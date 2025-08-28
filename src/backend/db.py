import os
from sqlalchemy import create_engine
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    print("⚠️  DATABASE_URL not found in environment variables!")
    print("Please add DATABASE_URL to your .env file")
    print("Example: DATABASE_URL=postgresql://username:password@localhost:5432/journal_db")
    # Use SQLite as fallback for development
    DATABASE_URL = "sqlite:///./journal.db"
    print(f"Using fallback SQLite database: {DATABASE_URL}")

print(f"🔗 Database URL: {DATABASE_URL}")

engine = create_engine(DATABASE_URL, echo=True)
