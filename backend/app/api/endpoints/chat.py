from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from app.models.chat import ChatSession, Message, MessageRole
from app.models.profile import StudentProfile
from app.services.ai_service import ai_service

router = APIRouter()

class ChatMessageRequest(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatMessageResponse(BaseModel):
    session_id: str
    message: str
    timestamp: str

@router.post("/message", response_model=ChatMessageResponse)
async def send_message(request: ChatMessageRequest, user_id: str):
    """Send a message and get AI response"""
    
    try:
        # For demo purposes, create a simple in-memory session
        # In production, this would use the database
        
        # Get student profile for context (if exists)
        profile_dict = None
        try:
            profile = await StudentProfile.find_one(StudentProfile.user_id == user_id)
            if profile:
                profile_dict = profile.dict()
        except Exception as e:
            print(f"Profile not found: {e}")
            # Continue without profile
        
        # Prepare conversation history
        conversation_history = []
        
        # Get AI response
        try:
            ai_response = await ai_service.get_career_counselling_response(
                user_message=request.message,
                conversation_history=conversation_history,
                student_profile=profile_dict
            )
        except Exception as e:
            print(f"AI service error: {e}")
            # Fallback response
            ai_response = "I'm here to help you with career guidance! I can help you explore different career paths, understand entrance exams, and plan your educational journey. What would you like to know?"
        
        # Create a simple session ID if none provided
        session_id = request.session_id or f"session-{user_id}-{datetime.utcnow().timestamp()}"
        
        return ChatMessageResponse(
            session_id=session_id,
            message=ai_response,
            timestamp=datetime.utcnow().isoformat()
        )
    
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing message: {str(e)}")

@router.get("/history/{session_id}")
async def get_chat_history(session_id: str):
    """Get chat history for a session"""
    
    try:
        session = await ChatSession.get(session_id)
        if not session:
            return {
                "session_id": session_id,
                "messages": []
            }
        
        return {
            "session_id": str(session.id),
            "messages": [
                {
                    "role": msg.role.value,
                    "content": msg.content,
                    "timestamp": msg.timestamp
                }
                for msg in session.messages
            ]
        }
    except Exception as e:
        print(f"Error getting history: {e}")
        return {
            "session_id": session_id,
            "messages": []
        }

@router.get("/sessions")
async def get_user_sessions(user_id: str):
    """Get all chat sessions for a user"""
    
    try:
        sessions = await ChatSession.find(
            ChatSession.user_id == user_id,
            ChatSession.is_active == True
        ).sort(-ChatSession.created_at).to_list()
        
        return [
            {
                "session_id": str(session.id),
                "created_at": session.created_at,
                "message_count": len(session.messages),
                "last_updated": session.updated_at
            }
            for session in sessions
        ]
    except Exception as e:
        print(f"Error getting sessions: {e}")
        return []

@router.delete("/session/{session_id}")
async def delete_session(session_id: str):
    """Delete a chat session"""
    
    try:
        session = await ChatSession.get(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        session.is_active = False
        await session.save()
        
        return {"message": "Session deleted successfully"}
    except Exception as e:
        print(f"Error deleting session: {e}")
        raise HTTPException(status_code=500, detail=str(e))