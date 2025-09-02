from sqlalchemy import Column, Integer, String, DateTime, JSON, ForeignKey
from datetime import datetime
from . import Base

class MonthlySummary(Base):
    __tablename__ = "monthly_summaries"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    month = Column(String(7), nullable=False)  # Removed unique constraint since multiple users can have same month
    daily_data = Column(JSON, nullable=False) 
    monthly_totals = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
