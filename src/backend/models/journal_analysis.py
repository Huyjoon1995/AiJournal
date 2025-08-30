from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from datetime import datetime
from . import Base

class JournalAnalysis(Base):
    __tablename__ = "journal_analysis"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    journal_text = Column(Text, nullable=False)  # Store the original journal text
    mood = Column(String(100), nullable=False)
    summary = Column(Text, nullable=False)
    reflection = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)