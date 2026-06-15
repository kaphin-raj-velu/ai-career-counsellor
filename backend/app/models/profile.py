from beanie import Document
from pydantic import Field
from typing import List, Optional
from datetime import datetime
from enum import Enum

class StreamEnum(str, Enum):
    SCIENCE = "Science"
    COMMERCE = "Commerce"
    ARTS = "Arts"

class LanguageEnum(str, Enum):
    ENGLISH = "en"
    HINDI = "hi"

class AcademicPerformance(Document):
    grade10_percentage: Optional[float] = None
    grade11_percentage: Optional[float] = None
    grade12_percentage: Optional[float] = None

class Location(Document):
    state: str
    city: str

class StudentProfile(Document):
    """Student profile with academic and personal information"""
    
    user_id: str = Field(..., unique=True, index=True)
    grade: int = Field(..., ge=9, le=12)
    stream: Optional[StreamEnum] = None
    subjects: List[str] = Field(default_factory=list)
    interests: List[str] = Field(default_factory=list)
    academic_performance: Optional[AcademicPerformance] = None
    preferred_language: LanguageEnum = LanguageEnum.ENGLISH
    location: Optional[Location] = None
    aptitude_completed: bool = False
    aptitude_result_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "student_profiles"
        indexes = ["user_id"]
    
    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "user123",
                "grade": 11,
                "stream": "Science",
                "subjects": ["Physics", "Chemistry", "Mathematics", "Computer Science"],
                "interests": ["Technology", "Research", "Innovation"],
                "location": {
                    "state": "Maharashtra",
                    "city": "Mumbai"
                }
            }
        }
