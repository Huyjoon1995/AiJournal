from pydantic import BaseModel

class JournalResponse(BaseModel):
    mood: str
    summary: str
    reflection: str