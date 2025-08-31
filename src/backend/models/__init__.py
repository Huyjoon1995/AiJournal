from sqlalchemy.orm import declarative_base

Base = declarative_base()

# Import models after Base is defined
from .user import User
from .journal_analysis import JournalAnalysis
from .monthly_summary import MonthlySummary

# Now that both models are imported, we can set up the relationships
from sqlalchemy.orm import relationship

# Add relationship to User model
User.journal_entries = relationship("JournalAnalysis", back_populates="user")

# Add relationship to JournalAnalysis model  
JournalAnalysis.user = relationship("User", back_populates="journal_entries")

__all__ = ['Base', 'User', 'JournalAnalysis', 'MonthlySummary']
