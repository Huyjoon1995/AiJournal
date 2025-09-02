#!/usr/bin/env python3
"""
Database backup script for AI Journal application
Run this script before making any database changes to backup your data
"""

import os
import json
from datetime import datetime
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

def backup_database():
    """Backup the database to JSON files"""
    
    # Get database URL
    DATABASE_URL = os.environ.get("DATABASE_URL")
    if not DATABASE_URL:
        print("DATABASE_URL not found in environment variables!")
        return
    
    # Create engine
    engine = create_engine(DATABASE_URL)
    
    # Create backup directory
    backup_dir = "backups"
    if not os.path.exists(backup_dir):
        os.makedirs(backup_dir)
    
    # Create timestamp for backup
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    try:
        with engine.connect() as connection:
            # Backup users table
            users_result = connection.execute(text("SELECT * FROM users"))
            users_data = [dict(row._mapping) for row in users_result]
            
            with open(f"{backup_dir}/users_{timestamp}.json", "w") as f:
                json.dump(users_data, f, indent=2, default=str)
            
            # Backup journal_analysis table
            journal_result = connection.execute(text("SELECT * FROM journal_analysis"))
            journal_data = [dict(row._mapping) for row in journal_result]
            
            with open(f"{backup_dir}/journal_analysis_{timestamp}.json", "w") as f:
                json.dump(journal_data, f, indent=2, default=str)
            
            # Backup monthly_summaries table (if it exists)
            try:
                summary_result = connection.execute(text("SELECT * FROM monthly_summaries"))
                summary_data = [dict(row._mapping) for row in summary_result]
                
                with open(f"{backup_dir}/monthly_summaries_{timestamp}.json", "w") as f:
                    json.dump(summary_data, f, indent=2, default=str)
            except Exception as e:
                print(f"Monthly summaries table doesn't exist yet: {e}")
            
            print(f"Database backup completed successfully!")
            print(f"Backup files created in {backup_dir}/")
            print(f"- users_{timestamp}.json")
            print(f"- journal_analysis_{timestamp}.json")
            if 'summary_data' in locals():
                print(f"- monthly_summaries_{timestamp}.json")
                
    except Exception as e:
        print(f"Error backing up database: {e}")

if __name__ == "__main__":
    backup_database()





