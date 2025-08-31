from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from sqlalchemy.orm import sessionmaker
from sqlalchemy import inspect
from db import engine
from models import Base, User as UserModel, JournalAnalysis as JournalAnalysisModel, MonthlySummary as MonthlySummaryModel
from collections import defaultdict, Counter
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

# Create tables if they don't exist (only if they don't exist)
try:
    # Check if tables exist before creating them
    inspector = inspect(engine)
    existing_tables = inspector.get_table_names()
    
    if not existing_tables:
        print("No tables found. Creating database tables...")
        Base.metadata.create_all(bind=engine)
        print("Database tables created successfully.")
    else:
        print(f"Found existing tables: {existing_tables}")
        print("Using existing database structure.")
except Exception as e:
    print(f"Error checking database: {e}")
    print("Creating tables as fallback...")
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
    
def generate_monthly_summary():
    db = SessionLocal()
    try:
        from datetime import datetime as dt
        start_of_month = dt(dt.now().year, dt.now().month, 1)
        entries = db.query(JournalAnalysisModel).filter(JournalAnalysisModel.created_at >= start_of_month).all()
        daily_data = defaultdict(lambda: Counter())
        monthly_totals = Counter()
        for entry in entries:
            day = entry.created_at.strftime("%Y-%m-%d")
            daily_data[day][entry.mood] +=1
            monthly_totals[entry.mood] +=1
        
        daily_data = {day: dict(counter) for day, counter in daily_data.items()}
        monthly_totals = dict(monthly_totals)
        
        month_str = start_of_month.strftime("%Y-%m")
        existing_summary = db.query(MonthlySummaryModel).filter_by(month=month_str).first()
        
        if existing_summary:
            existing_summary.daily_data = daily_data
            existing_summary.monthly_totals = monthly_totals
        else:
            summary = MonthlySummaryModel(
                month=month_str,
                daily_data=daily_data,
                monthly_totals=monthly_totals
            )
            db.add(summary)
        db.commit()
        print(f"[{dt.now()}] Monthly summary generated for {month_str}")
    finally:
        db.close()

@app.post("/analyze-journal", response_model=JournalAnalysisResponse)
async def analyze_journal(payload: JournalInput, current_user: UserModel = Depends(get_current_user)):
    print(f"Received journal analysis request for user: {current_user.id}")
    print(f"Journal text length: {len(payload.journal_text)}")
    prompt = (
        "Analyze the following journal entry and return a JSON object with:\n"
        "- mood (one word from a general category such as: happy, sad, angry, anxious, calm, stressed, hopeful, etc.)\n"
        "- summary (analyze like a therapist but somehow make it's easy to understand)\n"
        "- reflection (a thoughtful paragraph and some positive advise or encouragement depend on user's journal)\n"
        "Only return the JSON.\n\n"
        f"Journal Entry:\n{payload.journal_text}"
    )
    
    try:
        print(f"Calling OpenAI API with prompt: {prompt[:100]}...")
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",  # Using cheaper model for testing
            messages=[
                {"role": "system", "content": "You are a helpful assistant that analyzes journal entries."},
                {"role": "user", "content": prompt},
            ],
            max_tokens=200  # Limit tokens to reduce cost
        )
            
        raw_output = response.choices[0].message.content
        print(f"OpenAI API call successful")
    except openai.RateLimitError as e:
        print(f"OpenAI rate limit error: {e}")
        # Handle quota exceeded error specifically
        return JournalAnalysisResponse(
            mood="quota_exceeded",
            summary="OpenAI quota exceeded. Please check your account billing.",
            reflection="Your journal entry has been received. To enable AI analysis, please visit https://platform.openai.com/usage to check your account status and add billing information if needed.",
        )
    except Exception as e:
        print(f"OpenAI API error: {e}")
        # Handle other OpenAI errors
        return JournalAnalysisResponse(
            mood="error",
            summary=f"OpenAI API error: {str(e)}",
            reflection="There was an error connecting to the AI service. Please try again later.",
        )
    
    try:
        print(f"Raw OpenAI output: {raw_output}")
        parsed = json.loads(raw_output)
        print(f"Parsed OpenAI response: {parsed}")
        
        # Create database session
        session = SessionLocal()
        try:
            print(f"Creating journal analysis record for user_id: {current_user.id}")
            # Create new journal analysis record
            new_journal_analysis = JournalAnalysisModel(
                user_id=current_user.id,
                journal_text=payload.journal_text,
                mood=parsed.get("mood", ""),
                summary=parsed.get("summary", ""),
                reflection=parsed.get("reflection", "")
            )
            
            print(f"Adding journal analysis to session...")
            session.add(new_journal_analysis)
            print(f"Committing to database...")
            session.commit()
            print(f"Refreshing object...")
            session.refresh(new_journal_analysis)
            
            print(f"Successfully saved journal entry with ID: {new_journal_analysis.id}")
            print(f"Entry details: mood={new_journal_analysis.mood}, summary_length={len(new_journal_analysis.summary)}")
            
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
            print(f"User ID: {current_user.id}")
            print(f"Parsed data: {parsed}")
            # Return response without database ID if database fails
            return JournalAnalysisResponse(
                mood=parsed.get("mood", ""),
                summary=parsed.get("summary", ""),
                reflection=parsed.get("reflection", "")
            )
        finally:
            session.close()
            
    except json.JSONDecodeError as e:
        print(f"JSON parsing error: {e}")
        print(f"Raw output that failed to parse: {raw_output}")
        # Handle JSON parsing errors
        return JournalAnalysisResponse(
            mood="parsing_error",
            summary="Could not parse AI response",
            reflection="There was an error processing the AI analysis. Please try again.",
        )
    except Exception as e:
        print(f"Unexpected error in journal analysis: {e}")
        # Fallback response when anything fails
        return JournalAnalysisResponse(
            mood="neutral",
            summary="This is a test response while OpenAI quota is being resolved.",
            reflection="Your journal entry has been received. Please check your OpenAI account billing to enable AI analysis.",
        )

@app.get("/journal-entries")
async def get_journal_entries(current_user: UserModel = Depends(get_current_user)):
    """Get all journal entries from the database"""
    print(f"Fetching journal entries for user: {current_user.id}")
    session = SessionLocal()
    try:
        entries = session.query(JournalAnalysisModel).filter(JournalAnalysisModel.user_id == current_user.id).order_by(JournalAnalysisModel.created_at.desc()).all()
        print(f"Found {len(entries)} journal entries for user {current_user.id}")
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

@app.delete("/delete_journal/<int:entry_id")
def delete_journal(entry_id: int, current_user: UserModel = Depends(get_current_user)):
    """Delete journal based on it id from the database"""
    print(f"Deleting journal: {entry_id} for user: {current_user.id}")
    session = SessionLocal()
    try: 
        entry = session.query(JournalAnalysisModel).filter(JournalAnalysisModel.user_id == current_user.id, JournalAnalysisModel.id == entry_id).first()
        
        if not entry:
            print(f"Entry {entry_id} for user {current_user.id} not found")
            return False
        
        session.delete(entry)
        session.commit()
        print(f"Entry {entry_id} for user {current_user.id} deleted successfully")
        return True
    except Exception as e:
        session.rollback()
        print(f"Error deleting entry: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete journal entry")
    finally: 
        session.close(0)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
    