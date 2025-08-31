from sqlalchemy import Column, Integer, String, DateTime, JSON
from datetime import datetime
from . import Base

class MonthlySummary(Base):
    __tablename__ = "monthly_summaries"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    month = Column(String(7), unique=True, nullable=False)  # Format: "YYYY-MM"
    daily_data = Column(JSON, nullable=False)  # Store daily mood counts
    monthly_totals = Column(JSON, nullable=False)  # Store monthly mood totals
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
