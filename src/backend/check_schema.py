#!/usr/bin/env python3
"""
Check the actual database schema
"""

import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

def check_schema():
    """Check the actual database schema"""
    
    DATABASE_URL = os.environ.get("DATABASE_URL")
    if not DATABASE_URL:
        print("DATABASE_URL not found!")
        return
    
    engine = create_engine(DATABASE_URL)
    
    try:
        with engine.connect() as connection:
            # Check journal_analysis table schema
            print("=== Journal Analysis Table Schema ===")
            schema_result = connection.execute(text("""
                SELECT column_name, data_type, is_nullable 
                FROM information_schema.columns 
                WHERE table_name = 'journal_analysis' 
                ORDER BY ordinal_position
            """))
            
            for row in schema_result:
                print(f"Column: {row[0]}, Type: {row[1]}, Nullable: {row[2]}")
            
            # Check users table schema
            print("\n=== Users Table Schema ===")
            schema_result = connection.execute(text("""
                SELECT column_name, data_type, is_nullable 
                FROM information_schema.columns 
                WHERE table_name = 'users' 
                ORDER BY ordinal_position
            """))
            
            for row in schema_result:
                print(f"Column: {row[0]}, Type: {row[1]}, Nullable: {row[2]}")
            
    except Exception as e:
        print(f"Error checking schema: {e}")

if __name__ == "__main__":
    check_schema()





