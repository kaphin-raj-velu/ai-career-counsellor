from beanie import Document
from pydantic import EmailStr, Field
from typing import Optional
from datetime import datetime

class User(Document):
    """User model for authentication and profile management"""
    
    email: EmailStr = Field(..., unique=True, index=True)
    name: str = Field(..., min_length=2, max_length=100)
    hashed_password: str
    phone: Optional[str] = None
    is_active: bool = True
    is_verified: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "users"
        indexes = ["email"]
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "student@example.com",
                "name": "Rahul Kumar",
                "phone": "+91-9876543210"
            }
        }
