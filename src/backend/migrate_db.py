#!/usr/bin/env python3
"""
Migration script to add missing columns to the database
"""

import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

def migrate_database():
    """Add missing columns to the database"""
    
    DATABASE_URL = os.environ.get("DATABASE_URL")
    if not DATABASE_URL:
        print("DATABASE_URL not found!")
        return
    
    engine = create_engine(DATABASE_URL)
    
    try:
        with engine.connect() as connection:
            print("Starting database migration...")
            
            # Add missing columns to users table
            print("Adding missing columns to users table...")
            try:
                connection.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR"))
                print("✓ Added email column to users")
            except Exception as e:
                print(f"Email column already exists or error: {e}")
            
            try:
                connection.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR"))
                print("✓ Added name column to users")
            except Exception as e:
                print(f"Name column already exists or error: {e}")
            
            # Add missing columns to journal_analysis table
            print("Adding missing columns to journal_analysis table...")
            try:
                connection.execute(text("ALTER TABLE journal_analysis ADD COLUMN IF NOT EXISTS user_id INTEGER"))
                print("✓ Added user_id column to journal_analysis")
            except Exception as e:
                print(f"user_id column already exists or error: {e}")
            
            try:
                connection.execute(text("ALTER TABLE journal_analysis ADD COLUMN IF NOT EXISTS journal_text TEXT"))
                print("✓ Added journal_text column to journal_analysis")
            except Exception as e:
                print(f"journal_text column already exists or error: {e}")
            
            try:
                connection.execute(text("ALTER TABLE journal_analysis ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW()"))
                print("✓ Added created_at column to journal_analysis")
            except Exception as e:
                print(f"created_at column already exists or error: {e}")
            
            # Add foreign key constraint
            try:
                connection.execute(text("""
                    ALTER TABLE journal_analysis 
                    ADD CONSTRAINT fk_journal_user 
                    FOREIGN KEY (user_id) REFERENCES users(id)
                """))
                print("✓ Added foreign key constraint")
            except Exception as e:
                print(f"Foreign key constraint already exists or error: {e}")
            
            connection.commit()
            print("Database migration completed successfully!")
            
    except Exception as e:
        print(f"Error during migration: {e}")

if __name__ == "__main__":
    migrate_database()
