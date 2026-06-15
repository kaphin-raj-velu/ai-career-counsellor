from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
import os
from typing import Optional

from app.models.user import User
from app.models.chat import ChatSession
from app.models.profile import StudentProfile
from app.models.assessment import AssessmentResult

# MongoDB client
client: Optional[AsyncIOMotorClient] = None

async def init_db():
    """Initialize database connection and Beanie ODM"""
    global client
    
    # Get MongoDB URL from environment
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    database_name = os.getenv("DATABASE_NAME", "career_counsellor")
    
    # Create async MongoDB client
    client = AsyncIOMotorClient(mongodb_url)
    
    # Initialize Beanie with document models
    await init_beanie(
        database=client[database_name],
        document_models=[
            User,
            ChatSession,
            StudentProfile,
            AssessmentResult
        ]
    )

async def close_db():
    """Close database connection"""
    global client
    if client:
        client.close()

def get_database():
    """Get database instance"""
    if not client:
        raise Exception("Database not initialized")
    return client[os.getenv("DATABASE_NAME", "career_counsellor")]
