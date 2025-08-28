from db import engine
from models.journal_analysis import Base

Base.metadata.create_all(bind=engine)