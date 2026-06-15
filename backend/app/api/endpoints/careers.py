from fastapi import APIRouter, HTTPException
from typing import List, Optional
from pydantic import BaseModel

from app.data.careers import CAREERS_DATABASE
from app.models.profile import StudentProfile

router = APIRouter()

class CareerResponse(BaseModel):
    id: str
    name: str
    category: str
    description: str
    required_education: List[str]
    required_skills: List[str]
    average_salary: dict
    job_outlook: str
    top_colleges: List[str]
    entrance_exams: List[str]
    related_careers: List[str]

class CareerRecommendation(BaseModel):
    career: CareerResponse
    match_score: float
    reasoning: str

@router.get("/all", response_model=List[CareerResponse])
async def get_all_careers():
    """Get all available careers"""
    return CAREERS_DATABASE

@router.get("/{career_id}", response_model=CareerResponse)
async def get_career_details(career_id: str):
    """Get details of a specific career"""
    
    career = next((c for c in CAREERS_DATABASE if c["id"] == career_id), None)
    if not career:
        raise HTTPException(status_code=404, detail="Career not found")
    
    return career

@router.get("/category/{category}")
async def get_careers_by_category(category: str):
    """Get careers filtered by category"""
    
    careers = [c for c in CAREERS_DATABASE if c["category"].lower() == category.lower()]
    return careers

@router.post("/recommendations", response_model=List[CareerRecommendation])
async def get_career_recommendations(user_id: str):
    """Get personalized career recommendations based on student profile"""
    
    try:
        # Get student profile
        profile = await StudentProfile.find_one(StudentProfile.user_id == user_id)
        
        # If no profile, return default recommendations
        if not profile:
            print(f"No profile found for user {user_id}, returning default recommendations")
            return get_default_recommendations()
        
        # Simple recommendation algorithm (in production, use AI/ML)
        recommendations = []
        
        # Match based on stream
        stream_career_mapping = {
            "Science": ["Engineering", "Medical", "Technology"],
            "Commerce": ["Commerce", "Business"],
            "Arts": ["Arts & Humanities", "Design & Arts", "Arts & Sciences"]
        }
        
        relevant_categories = stream_career_mapping.get(profile.stream, [])
        
        for career in CAREERS_DATABASE:
            score = 0
            reasoning_parts = []
            
            # Category match
            if career["category"] in relevant_categories:
                score += 40
                reasoning_parts.append(f"Aligns with your {profile.stream} stream")
            
            # Interest match
            interest_keywords = {
                "Technology": ["Computer", "Data", "AI", "Software"],
                "Medicine": ["Medical", "Health", "Doctor"],
                "Business": ["Commerce", "Finance", "Account"],
                "Design": ["Fashion", "Design", "Creative"]
            }
            
            for interest in profile.interests:
                for keyword in interest_keywords.get(interest, []):
                    if keyword.lower() in career["name"].lower() or keyword.lower() in career["description"].lower():
                        score += 20
                        reasoning_parts.append(f"Matches your interest in {interest}")
                        break
            
            # Subject match
            if profile.stream == "Science" and any(sub in ["Physics", "Mathematics", "Computer Science"] for sub in profile.subjects):
                if career["category"] in ["Engineering", "Technology"]:
                    score += 20
                    reasoning_parts.append("Your strong science background is ideal for this field")
            
            if score > 40:
                recommendations.append(
                    CareerRecommendation(
                        career=career,
                        match_score=min(score, 100),
                        reasoning=". ".join(reasoning_parts) if reasoning_parts else "Good general fit based on your profile"
                    )
                )
        
        # Sort by match score
        recommendations.sort(key=lambda x: x.match_score, reverse=True)
        
        # Return top 5 or default if none found
        result = recommendations[:5] if recommendations else get_default_recommendations()
        return result
    
    except Exception as e:
        print(f"Error getting recommendations: {e}")
        # Return default recommendations on error
        return get_default_recommendations()

def get_default_recommendations() -> List[CareerRecommendation]:
    """Get default career recommendations when no profile exists"""
    default_careers = CAREERS_DATABASE[:3]  # Top 3 careers
    
    return [
        CareerRecommendation(
            career=career,
            match_score=80.0,
            reasoning="Popular career option for high school students"
        )
        for career in default_careers
    ]

@router.get("/search/{query}")
async def search_careers(query: str):
    """Search careers by keyword"""
    
    query_lower = query.lower()
    results = [
        c for c in CAREERS_DATABASE
        if query_lower in c["name"].lower() or 
           query_lower in c["description"].lower() or
           any(query_lower in skill.lower() for skill in c["required_skills"])
    ]
    
    return results