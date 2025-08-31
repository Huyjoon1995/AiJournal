#!/usr/bin/env python3
"""
Test script to verify database operations
"""

import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

def test_database():
    """Test database connection and operations"""
    
    DATABASE_URL = os.environ.get("DATABASE_URL")
    if not DATABASE_URL:
        print("DATABASE_URL not found!")
        return
    
    engine = create_engine(DATABASE_URL)
    
    try:
        with engine.connect() as connection:
            # Test users table
            print("=== Testing Users Table ===")
            users_result = connection.execute(text("SELECT COUNT(*) as count FROM users"))
            users_count = users_result.fetchone()[0]
            print(f"Users count: {users_count}")
            
            if users_count > 0:
                user_result = connection.execute(text("SELECT * FROM users LIMIT 1"))
                user = user_result.fetchone()
                print(f"Sample user: ID={user[0]}, Auth0_ID={user[1]}")
            
            # Test journal_analysis table
            print("\n=== Testing Journal Analysis Table ===")
            journal_result = connection.execute(text("SELECT COUNT(*) as count FROM journal_analysis"))
            journal_count = journal_result.fetchone()[0]
            print(f"Journal entries count: {journal_count}")
            
            if journal_count > 0:
                journal_result = connection.execute(text("SELECT * FROM journal_analysis LIMIT 1"))
                journal = journal_result.fetchone()
                print(f"Sample journal entry: ID={journal[0]}, User_ID={journal[1]}, Mood={journal[3]}")
            
            # Test monthly_summaries table
            print("\n=== Testing Monthly Summaries Table ===")
            try:
                summary_result = connection.execute(text("SELECT COUNT(*) as count FROM monthly_summaries"))
                summary_count = summary_result.fetchone()[0]
                print(f"Monthly summaries count: {summary_count}")
            except Exception as e:
                print(f"Monthly summaries table error: {e}")
            
            print("\n=== Database Test Complete ===")
            
    except Exception as e:
        print(f"Database test error: {e}")

if __name__ == "__main__":
    test_database()
