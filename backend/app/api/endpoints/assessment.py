from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict
from datetime import datetime

from app.models.assessment import AssessmentResult, CategoryScore
from app.models.profile import StudentProfile

router = APIRouter()

# Sample aptitude questions
APTITUDE_QUESTIONS = [
    {
        "id": "q1",
        "text": "If 5 workers can complete a task in 10 days, how many days will 10 workers take?",
        "type": "multiple-choice",
        "options": ["5 days", "10 days", "20 days", "2.5 days"],
        "correct_answer": "5 days",
        "category": "logical"
    },
    {
        "id": "q2",
        "text": "Complete the series: 2, 6, 12, 20, 30, ?",
        "type": "multiple-choice",
        "options": ["40", "42", "44", "48"],
        "correct_answer": "42",
        "category": "numerical"
    },
    {
        "id": "q3",
        "text": "Choose the word most similar to 'Abundant'",
        "type": "multiple-choice",
        "options": ["Scarce", "Plentiful", "Rare", "Limited"],
        "correct_answer": "Plentiful",
        "category": "verbal"
    },
    {
        "id": "q4",
        "text": "I enjoy solving complex problems and puzzles",
        "type": "rating",
        "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
        "category": "interest"
    },
    {
        "id": "q5",
        "text": "What is 25% of 80?",
        "type": "multiple-choice",
        "options": ["15", "20", "25", "30"],
        "correct_answer": "20",
        "category": "numerical"
    },
    {
        "id": "q6",
        "text": "I prefer working with people rather than data",
        "type": "rating",
        "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
        "category": "interest"
    },
    {
        "id": "q7",
        "text": "Find the odd one out: Triangle, Circle, Square, Rectangle",
        "type": "multiple-choice",
        "options": ["Triangle", "Circle", "Square", "Rectangle"],
        "correct_answer": "Circle",
        "category": "spatial"
    },
    {
        "id": "q8",
        "text": "I am interested in understanding how things work",
        "type": "rating",
        "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
        "category": "interest"
    },
    {
        "id": "q9",
        "text": "Choose the correct analogy: Book is to Reading as Fork is to ?",
        "type": "multiple-choice",
        "options": ["Drawing", "Writing", "Eating", "Cutting"],
        "correct_answer": "Eating",
        "category": "logical"
    },
    {
        "id": "q10",
        "text": "I enjoy creative and artistic activities",
        "type": "rating",
        "options": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
        "category": "interest"
    }
]

class AssessmentSubmission(BaseModel):
    answers: List[Dict[str, str]]

class AssessmentResponse(BaseModel):
    result_id: str
    overall_score: float
    category_scores: Dict[str, float]
    strengths: List[str]
    weaknesses: List[str]
    recommended_fields: List[str]

@router.get("/questions")
async def get_assessment_questions():
    """Get aptitude assessment questions"""
    return APTITUDE_QUESTIONS

@router.post("/submit", response_model=AssessmentResponse)
async def submit_assessment(user_id: str, submission: AssessmentSubmission):
    """Submit aptitude assessment and get results"""
    
    # Calculate scores
    category_scores = {
        "logical": 0,
        "verbal": 0,
        "numerical": 0,
        "spatial": 0,
        "interest": 0
    }
    
    category_counts = {k: 0 for k in category_scores.keys()}
    
    # Score each answer
    for answer_data in submission.answers:
        question_id = answer_data.get("questionId")
        user_answer = answer_data.get("answer")
        
        question = next((q for q in APTITUDE_QUESTIONS if q["id"] == question_id), None)
        if not question:
            continue
        
        category = question["category"]
        category_counts[category] += 1
        
        if question["type"] == "multiple-choice":
            if user_answer == question.get("correct_answer"):
                category_scores[category] += 100
        elif question["type"] == "rating":
            # Convert rating to score (0-100)
            rating_values = {
                "Strongly Disagree": 20,
                "Disagree": 40,
                "Neutral": 60,
                "Agree": 80,
                "Strongly Agree": 100
            }
            category_scores[category] += rating_values.get(user_answer, 60)
    
    # Calculate average scores
    for category in category_scores:
        if category_counts[category] > 0:
            category_scores[category] = category_scores[category] / category_counts[category]
    
    # Calculate overall score
    overall_score = sum(category_scores.values()) / len(category_scores)
    
    # Determine strengths and weaknesses
    sorted_scores = sorted(category_scores.items(), key=lambda x: x[1], reverse=True)
    strengths = [cat.capitalize() + " Reasoning" for cat, score in sorted_scores[:2] if score > 60]
    weaknesses = [cat.capitalize() + " Skills" for cat, score in sorted_scores[-2:] if score < 50]
    
    # Recommend fields based on scores
    recommended_fields = []
    if category_scores["logical"] > 70 and category_scores["numerical"] > 70:
        recommended_fields.extend(["Engineering", "Computer Science", "Mathematics"])
    if category_scores["verbal"] > 70:
        recommended_fields.extend(["Law", "Journalism", "Literature"])
    if category_scores["interest"] > 70:
        recommended_fields.extend(["Research", "Innovation", "Technology"])
    if category_scores["spatial"] > 70:
        recommended_fields.extend(["Architecture", "Design", "Art"])
    
    recommended_fields = list(set(recommended_fields))[:3]
    
    # Save results
    result = AssessmentResult(
        user_id=user_id,
        overall_score=overall_score,
        category_scores=CategoryScore(**category_scores),
        strengths=strengths,
        weaknesses=weaknesses,
        recommended_fields=recommended_fields,
        answers=submission.answers,
        time_taken_seconds=300  # Mock value
    )
    
    await result.insert()
    
    # Update student profile
    profile = await StudentProfile.find_one(StudentProfile.user_id == user_id)
    if profile:
        profile.aptitude_completed = True
        profile.aptitude_result_id = str(result.id)
        await profile.save()
    
    return AssessmentResponse(
        result_id=str(result.id),
        overall_score=overall_score,
        category_scores=category_scores,
        strengths=strengths,
        weaknesses=weaknesses,
        recommended_fields=recommended_fields
    )

@router.get("/results/{result_id}")
async def get_assessment_results(result_id: str):
    """Get assessment results by ID"""
    
    result = await AssessmentResult.get(result_id)
    if not result:
        raise HTTPException(status_code=404, detail="Results not found")
    
    return {
        "result_id": str(result.id),
        "overall_score": result.overall_score,
        "category_scores": result.category_scores.dict(),
        "strengths": result.strengths,
        "weaknesses": result.weaknesses,
        "recommended_fields": result.recommended_fields,
        "completed_at": result.completed_at
    }

@router.get("/user-results")
async def get_user_results(user_id: str):
    """Get all assessment results for a user"""
    
    results = await AssessmentResult.find(
        AssessmentResult.user_id == user_id
    ).sort(-AssessmentResult.completed_at).to_list()
    
    return [
        {
            "result_id": str(r.id),
            "overall_score": r.overall_score,
            "completed_at": r.completed_at
        }
        for r in results
    ]
