from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from sqlalchemy.orm import sessionmaker
from db import engine
from models import Base, User as UserModel, JournalAnalysis as JournalAnalysisModel
import openai
import os
import json
import requests
import uvicorn
from datetime import datetime
from jose import jwt

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials = True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

JWKS_URL = "https://dev-3fas6re2rfmlpqmh.us.auth0.com/.well-known/jwks.json"
AUDIENCE = "http://localhost:8000"
ISSUER = "https://dev-3fas6re2rfmlpqmh.us.auth0.com/"
ALGORITHMS = ["RS256"]

SessionLocal = sessionmaker(autoflush=False, bind=engine)

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

class JournalInput(BaseModel):
    journal_text: str
    
class JournalAnalysisResponse(BaseModel):
    mood: str
    summary: str
    reflection: str
    id: int = None
    created_at: datetime = None
    
def get_jwk(token):
    # Get the header without verifying signature
    unverified_header = jwt.get_unverified_header(token)
    
    if "kid" not in unverified_header:
        raise HTTPException(status_code=401, detail="Invalid token header")

    jwks = requests.get(JWKS_URL).json()
    
    for key in jwks["keys"]:
        if key["kid"] == unverified_header["kid"]:
            return key
    
    raise HTTPException(status_code=401, detail="Public key not found")

def verify_token(token: str):
    print(f"Verifying token...")
    jwk = get_jwk(token)
    print(f"Found JWK with kid: {jwk.get('kid', 'unknown')}")
    
    try:
        # Use the JWK directly with python-jose
        payload = jwt.decode(
            token,
            jwk,
            algorithms=ALGORITHMS,
            audience=AUDIENCE,
            issuer=ISSUER
        )
        print(f"Token decoded successfully")
        return payload
    except jwt.ExpiredSignatureError:
        print(f"Token expired")
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTClaimsError as e:
        print(f"Invalid claims: {str(e)}")
        raise HTTPException(status_code=401, detail=f"Invalid claims: {str(e)}")
    except Exception as e:
        print(f"Token verification failed: {str(e)}")
        raise HTTPException(status_code=401, detail=f"Token verification failed: {str(e)}")
    
def get_current_user(credentials=Depends(security)):
    token = credentials.credentials  # Bearer token
    print(f"Received token: {token[:50]}...")
    
    try:
        payload = verify_token(token)
        print(f"Token verified successfully")
        print(f"Token payload: {payload}")
        
        auth0_sub = payload["sub"]  # The unique user ID
        print(f"Auth0 sub: {auth0_sub}")
        
        session = SessionLocal()
        user = session.query(UserModel).filter_by(auth0_id=auth0_sub).first()
        session.close()

        if not user:
            print(f"User not found in database for auth0_id: {auth0_sub}")
            # Create user if not found
            session = SessionLocal()
            new_user = UserModel(
                auth0_id=auth0_sub,
                email=payload.get("email", ""),
                name=payload.get("name", "")
            )
            session.add(new_user)
            session.commit()
            session.refresh(new_user)
            session.close()
            print(f"Created new user: {new_user.id}")
            return new_user
        
        print(f"Found existing user: {user.id}")
        return user
        
    except Exception as e:
        print(f"Error in get_current_user: {str(e)}")
        raise

@app.post("/analyze-journal", response_model=JournalAnalysisResponse)
async def analyze_journal(payload: JournalInput, current_user: UserModel = Depends(get_current_user)):
    prompt = (
        "Analyze the following journal entry and return a JSON object with:\n"
        "- mood (one word from a general category such as: happy, sad, angry, anxious, calm, stressed, hopeful, etc.)\n"
        "- summary (analyze like a therapist but somehow make it's easy to understand)\n"
        "- reflection (a thoughtful paragraph and some positive advise or encouragement depend on user's journal)\n"
        "Only return the JSON.\n\n"
        f"Journal Entry:\n{payload.journal_text}"
    )
    
    try:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",  # Using cheaper model for testing
            messages=[
                {"role": "system", "content": "You are a helpful assistant that analyzes journal entries."},
                {"role": "user", "content": prompt},
            ],
            max_tokens=200  # Limit tokens to reduce cost
        )
            
        raw_output = response.choices[0].message.content
    except openai.RateLimitError as e:
        # Handle quota exceeded error specifically
        return JournalAnalysisResponse(
            mood="quota_exceeded",
            summary="OpenAI quota exceeded. Please check your account billing.",
            reflection="Your journal entry has been received. To enable AI analysis, please visit https://platform.openai.com/usage to check your account status and add billing information if needed.",
        )
    except Exception as e:
        # Handle other OpenAI errors
        return JournalAnalysisResponse(
            mood="error",
            summary=f"OpenAI API error: {str(e)}",
            reflection="There was an error connecting to the AI service. Please try again later.",
        )
    
    try:
        parsed = json.loads(raw_output)
        
        # Create database session
        session = SessionLocal()
        try:
            # Create new journal analysis record
            new_journal_analysis = JournalAnalysisModel(
                user_id=current_user.id,
                journal_text=payload.journal_text,
                mood=parsed.get("mood", ""),
                summary=parsed.get("summary", ""),
                reflection=parsed.get("reflection", "")
            )
            
            session.add(new_journal_analysis)
            session.commit()
            session.refresh(new_journal_analysis)
            
            # Return the response with database ID and timestamp
            return JournalAnalysisResponse(
                id=new_journal_analysis.id,
                mood=new_journal_analysis.mood,
                summary=new_journal_analysis.summary,
                reflection=new_journal_analysis.reflection,
                created_at=new_journal_analysis.created_at
            )
            
        except Exception as db_error:
            session.rollback()
            print(f"Database error: {db_error}")
            # Return response without database ID if database fails
            return JournalAnalysisResponse(
                mood=parsed.get("mood", ""),
                summary=parsed.get("summary", ""),
                reflection=parsed.get("reflection", "")
            )
        finally:
            session.close()
            
    except json.JSONDecodeError as e:
        # Handle JSON parsing errors
        return JournalAnalysisResponse(
            mood="parsing_error",
            summary="Could not parse AI response",
            reflection="There was an error processing the AI analysis. Please try again.",
        )
    except Exception as e:
        # Fallback response when anything fails
        return JournalAnalysisResponse(
            mood="neutral",
            summary="This is a test response while OpenAI quota is being resolved.",
            reflection="Your journal entry has been received. Please check your OpenAI account billing to enable AI analysis.",
        )

@app.get("/journal-entries")
async def get_journal_entries(current_user: UserModel = Depends(get_current_user)):
    """Get all journal entries from the database"""
    session = SessionLocal()
    try:
        entries = session.query(JournalAnalysisModel).filter(JournalAnalysisModel.user_id == current_user.id).order_by(JournalAnalysisModel.created_at.desc()).all()
        return [
            {
                "id": entry.id,
                "journal_text": entry.journal_text,
                "mood": entry.mood,
                "summary": entry.summary,
                "reflection": entry.reflection,
                "created_at": entry.created_at.isoformat() if entry.created_at else None
            }
            for entry in entries
        ]
    except Exception as e:
        print(f"Error fetching journal entries: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch journal entries")
    finally:
        session.close()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
    