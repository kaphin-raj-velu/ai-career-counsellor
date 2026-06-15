from beanie import Document
from pydantic import Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class MessageRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"

class Message(Document):
    role: MessageRole
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    metadata: Optional[Dict[str, Any]] = None

class ChatSession(Document):
    """Chat session model to store conversation history"""
    
    user_id: str = Field(..., index=True)
    messages: List[Message] = Field(default_factory=list)
    session_type: str = "career_counselling"  # career_counselling, assessment, roadmap
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "chat_sessions"
        indexes = ["user_id", "created_at"]
    
    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "user123",
                "messages": [
                    {
                        "role": "user",
                        "content": "I'm interested in engineering. What should I do?",
                        "timestamp": "2024-02-01T10:00:00"
                    },
                    {
                        "role": "assistant",
                        "content": "That's great! Engineering offers many exciting paths...",
                        "timestamp": "2024-02-01T10:00:05"
                    }
                ],
                "session_type": "career_counselling"
            }
        }
