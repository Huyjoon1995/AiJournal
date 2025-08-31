#!/usr/bin/env python3
"""
Database restore script for AI Journal application
Use this script to restore data from backup files
"""

import os
import json
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

def restore_database(backup_timestamp):
    """Restore the database from JSON backup files"""
    
    # Get database URL
    DATABASE_URL = os.environ.get("DATABASE_URL")
    if not DATABASE_URL:
        print("DATABASE_URL not found in environment variables!")
        return
    
    # Create engine
    engine = create_engine(DATABASE_URL)
    
    backup_dir = "backups"
    
    try:
        with engine.connect() as connection:
            # Restore users table
            users_file = f"{backup_dir}/users_{backup_timestamp}.json"
            if os.path.exists(users_file):
                with open(users_file, "r") as f:
                    users_data = json.load(f)
                
                # Clear existing users
                connection.execute(text("DELETE FROM users"))
                
                # Insert backup data
                for user in users_data:
                    connection.execute(text("""
                        INSERT INTO users (id, auth0_id, email, name, picture)
                        VALUES (:id, :auth0_id, :email, :name, :picture)
                    """), user)
                
                print(f"Restored {len(users_data)} users")
            
            # Restore journal_analysis table
            journal_file = f"{backup_dir}/journal_analysis_{backup_timestamp}.json"
            if os.path.exists(journal_file):
                with open(journal_file, "r") as f:
                    journal_data = json.load(f)
                
                # Clear existing journal entries
                connection.execute(text("DELETE FROM journal_analysis"))
                
                # Insert backup data
                for entry in journal_data:
                    connection.execute(text("""
                        INSERT INTO journal_analysis (id, user_id, journal_text, mood, summary, reflection, created_at)
                        VALUES (:id, :user_id, :journal_text, :mood, :summary, :reflection, :created_at)
                    """), entry)
                
                print(f"Restored {len(journal_data)} journal entries")
            
            # Restore monthly_summaries table
            summary_file = f"{backup_dir}/monthly_summaries_{backup_timestamp}.json"
            if os.path.exists(summary_file):
                with open(summary_file, "r") as f:
                    summary_data = json.load(f)
                
                # Clear existing summaries
                connection.execute(text("DELETE FROM monthly_summaries"))
                
                # Insert backup data
                for summary in summary_data:
                    connection.execute(text("""
                        INSERT INTO monthly_summaries (id, month, daily_data, monthly_totals, created_at, updated_at)
                        VALUES (:id, :month, :daily_data, :monthly_totals, :created_at, :updated_at)
                    """), summary)
                
                print(f"Restored {len(summary_data)} monthly summaries")
            
            connection.commit()
            print("Database restore completed successfully!")
            
    except Exception as e:
        print(f"Error restoring database: {e}")

def list_backups():
    """List available backup files"""
    backup_dir = "backups"
    if not os.path.exists(backup_dir):
        print("No backups directory found!")
        return
    
    backups = []
    for file in os.listdir(backup_dir):
        if file.endswith('.json'):
            timestamp = file.split('_')[1].split('.')[0]
            backups.append(timestamp)
    
    if backups:
        print("Available backups:")
        for backup in sorted(backups, reverse=True):
            print(f"  {backup}")
    else:
        print("No backup files found!")

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        if sys.argv[1] == "list":
            list_backups()
        else:
            restore_database(sys.argv[1])
    else:
        print("Usage:")
        print("  python restore_db.py list                    # List available backups")
        print("  python restore_db.py 20241230_143022        # Restore from specific backup")
