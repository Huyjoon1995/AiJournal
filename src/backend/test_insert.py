#!/usr/bin/env python3
"""
Test script to manually insert a journal entry
"""

import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

def test_insert():
    """Test inserting a journal entry manually"""
    
    DATABASE_URL = os.environ.get("DATABASE_URL")
    if not DATABASE_URL:
        print("DATABASE_URL not found!")
        return
    
    engine = create_engine(DATABASE_URL)
    
    try:
        with engine.connect() as connection:
            # First, check if we have a user
            user_result = connection.execute(text("SELECT id FROM users LIMIT 1"))
            user = user_result.fetchone()
            
            if not user:
                print("No users found in database!")
                return
            
            user_id = user[0]
            print(f"Using user ID: {user_id}")
            
            # Insert a test journal entry
            insert_query = text("""
                INSERT INTO journal_analysis (user_id, journal_text, mood, summary, reflection, created_at)
                VALUES (:user_id, :journal_text, :mood, :summary, :reflection, NOW())
            """)
            
            test_data = {
                'user_id': user_id,
                'journal_text': 'This is a test journal entry to verify the database works.',
                'mood': 'happy',
                'summary': 'This is a test summary.',
                'reflection': 'This is a test reflection.'
            }
            
            connection.execute(insert_query, test_data)
            connection.commit()
            
            print("Test journal entry inserted successfully!")
            
            # Verify it was inserted
            count_result = connection.execute(text("SELECT COUNT(*) FROM journal_analysis"))
            count = count_result.fetchone()[0]
            print(f"Total journal entries now: {count}")
            
    except Exception as e:
        print(f"Error inserting test data: {e}")

if __name__ == "__main__":
    test_insert()
