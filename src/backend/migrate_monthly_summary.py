#!/usr/bin/env python3
"""
Migration script to add user_id column to monthly_summaries table
"""

import os
import sys
from sqlalchemy import text
from db import engine

def migrate_monthly_summary():
    """Add user_id column to monthly_summaries table"""
    
    with engine.connect() as conn:
        try:
            # Check if user_id column already exists
            result = conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'monthly_summaries' 
                AND column_name = 'user_id'
            """))
            
            if result.fetchone():
                print("user_id column already exists in monthly_summaries table")
                return
            
            # Add user_id column
            print("Adding user_id column to monthly_summaries table...")
            conn.execute(text("""
                ALTER TABLE monthly_summaries 
                ADD COLUMN user_id INTEGER NOT NULL DEFAULT 1
            """))
            
            # Add foreign key constraint
            print("Adding foreign key constraint...")
            conn.execute(text("""
                ALTER TABLE monthly_summaries 
                ADD CONSTRAINT fk_monthly_summaries_user 
                FOREIGN KEY (user_id) REFERENCES users(id)
            """))
            
            # Update existing records to have user_id = 1 (assuming first user)
            print("Updating existing records with user_id = 1...")
            conn.execute(text("""
                UPDATE monthly_summaries 
                SET user_id = 1 
                WHERE user_id IS NULL OR user_id = 0
            """))
            
            # Remove the default constraint
            print("Removing default constraint...")
            conn.execute(text("""
                ALTER TABLE monthly_summaries 
                ALTER COLUMN user_id DROP DEFAULT
            """))
            
            conn.commit()
            print("Migration completed successfully!")
            
        except Exception as e:
            print(f"Migration failed: {e}")
            conn.rollback()
            raise

if __name__ == "__main__":
    migrate_monthly_summary()

