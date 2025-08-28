from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.orm import declarative_base
from datetime import datetime

Base = declarative_base()

class JournalAnalysis(Base):
    __tablename__ = "journal_analysis"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    journal_text = Column(Text, nullable=False)  # Store the original journal text
    mood = Column(String(100), nullable=False)
    summary = Column(Text, nullable=False)
    reflection = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)