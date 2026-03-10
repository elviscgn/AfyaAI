import sqlite3
import json
from datetime import datetime, timedelta
from typing import List, Dict, Optional
from dataclasses import dataclass

DB_NAME = "afya.db"

@dataclass
class CheckinRecord:
    date: datetime
    sleep_hours: Optional[float]
    mood: Optional[int]
    hydration: Optional[int]
    symptoms: List[str]
    notes: Optional[str]

class MemoryService:
    """
    Handles persistent storage and retrieval of chat history and daily 
    health check-ins using SQLite.
    """
    def __init__(self):
        # check_same_thread=False is important for FastAPI to prevent SQLite thread errors
        self.conn = sqlite3.connect(DB_NAME, check_same_thread=False)
        self.conn.row_factory = sqlite3.Row
        self.cursor = self.conn.cursor()
        
        self._create_tables()

    def _create_tables(self):
        """Creates the necessary tables if they don't already exist."""
        
        # 1. Chat History Table
        create_chat_table = """
        CREATE TABLE IF NOT EXISTS chat_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT NOT NULL,
            role TEXT NOT NULL,
            content TEXT NOT NULL,
            timestamp TEXT NOT NULL
        );
        """
        
        # 2. Daily Check-ins Table
        create_checkin_table = """
        CREATE TABLE IF NOT EXISTS daily_checkins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            date TEXT NOT NULL,
            sleep_hours REAL,
            mood INTEGER,
            hydration INTEGER,
            symptoms TEXT,
            notes TEXT
        );
        """
        self.cursor.execute(create_chat_table)
        self.cursor.execute(create_checkin_table)
        self.conn.commit()



    def add_message(self, session_id: str, role: str, content: str):
        """Adds a new message (user or assistant) to the database."""
        current_time = datetime.utcnow().isoformat()
        
        insert_query = """
        INSERT INTO chat_history (session_id, role, content, timestamp)
        VALUES (?, ?, ?, ?);
        """
        self.cursor.execute(insert_query, (session_id, role, content, current_time))
        self.conn.commit()

    def get_recent_messages(self, session_id: str, limit: int = 5) -> List[Dict[str, str]]:
        """
        Retrieves the last 'limit' messages for a specific session.
        Returns messages in the format expected by the LLM.
        """
        select_query = """
        SELECT role, content 
        FROM chat_history 
        WHERE session_id = ?
        ORDER BY timestamp DESC 
        LIMIT ?;
        """
        self.cursor.execute(select_query, (session_id, limit))
        
        results = [dict(row) for row in self.cursor.fetchall()]
        return results[::-1] # Reverse to get chronological order

   
    def save_checkin(self, user_id: str, sleep_hours: Optional[float] = None, 
                     mood: Optional[int] = None, hydration: Optional[int] = None, 
                     symptoms: List[str] = None, notes: Optional[str] = None):
        """Saves a daily wellness check-in to the database."""
        current_time = datetime.utcnow().isoformat()
        
        # Convert symptoms list to a JSON string for SQLite storage
        symptoms_str = json.dumps(symptoms) if symptoms else "[]"
        
        insert_query = """
        INSERT INTO daily_checkins (user_id, date, sleep_hours, mood, hydration, symptoms, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?);
        """
        self.cursor.execute(insert_query, (user_id, current_time, sleep_hours, mood, hydration, symptoms_str, notes))
        self.conn.commit()

    def get_checkins(self, user_id: str, days: int = 7) -> List[CheckinRecord]:
        """
        Pulls the check-in history for the last X days.
        Used by the dynamic AI context builder to give the bot memory.
        """
        cutoff_date = (datetime.utcnow() - timedelta(days=days)).isoformat()
        
        select_query = """
        SELECT date, sleep_hours, mood, hydration, symptoms, notes
        FROM daily_checkins
        WHERE user_id = ? AND date >= ?
        ORDER BY date ASC;
        """
        self.cursor.execute(select_query, (user_id, cutoff_date))
        rows = self.cursor.fetchall()
        
        records = []
        for row in rows:
            # Parse the string date back into a Python datetime object
            dt = datetime.fromisoformat(row['date'])
            
            # Parse the JSON string back into a Python list
            try:
                symp_list = json.loads(row['symptoms'])
            except json.JSONDecodeError:
                symp_list = []
                
            record = CheckinRecord(
                date=dt,
                sleep_hours=row['sleep_hours'],
                mood=row['mood'],
                hydration=row['hydration'],
                symptoms=symp_list,
                notes=row['notes']
            )
            records.append(record)
            
        return records

    def close_connection(self):
        """Safely closes the database connection."""
        self.conn.close()


# --- Quick Test Block ---
if __name__ == "__main__":
    memory = MemoryService()
    TEST_ID = "user_alpha_777"

    print("--- 1. Testing Chat Memory ---")
    memory.add_message(TEST_ID, "user", "Hello Mmathando, I have been feeling anxious today.")
    history = memory.get_recent_messages(TEST_ID, limit=1)
    print(f"Chat History Saved: {history}")
    
    print("\n--- 2. Testing Daily Check-ins ---")
    memory.save_checkin(
        user_id=TEST_ID, 
        sleep_hours=5.5, 
        mood=4, 
        hydration=3, 
        symptoms=["headache", "fatigue"],
        notes="Stressed about hackathon"
    )
    checkins = memory.get_checkins(TEST_ID, days=7)
    print(f"Latest Check-in Date: {checkins[-1].date}")
    print(f"Latest Check-in Mood: {checkins[-1].mood}/10")
    print(f"Latest Check-in Symptoms: {checkins[-1].symptoms}")
    
    memory.close_connection()