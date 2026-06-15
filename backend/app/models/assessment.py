from beanie import Document
from pydantic import Field
from typing import List, Dict
from datetime import datetime

class CategoryScore(Document):
    logical: float = 0.0
    verbal: float = 0.0
    numerical: float = 0.0
    spatial: float = 0.0
    interest: float = 0.0

class AssessmentResult(Document):
    """Aptitude assessment results"""
    
    user_id: str = Field(..., index=True)
    overall_score: float = Field(..., ge=0, le=100)
    category_scores: CategoryScore
    strengths: List[str] = Field(default_factory=list)
    weaknesses: List[str] = Field(default_factory=list)
    recommended_fields: List[str] = Field(default_factory=list)
    answers: List[Dict] = Field(default_factory=list)  # Store user answers
    time_taken_seconds: int
    completed_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "assessment_results"
        indexes = ["user_id", "completed_at"]
    
    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "user123",
                "overall_score": 78.5,
                "category_scores": {
                    "logical": 85,
                    "verbal": 72,
                    "numerical": 80,
                    "spatial": 75,
                    "interest": 88
                },
                "strengths": ["Logical Reasoning", "Problem Solving"],
                "weaknesses": ["Verbal Communication"],
                "recommended_fields": ["Computer Science", "Engineering", "Data Science"]
            }
        }
