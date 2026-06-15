from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

# Import routers
from app.api.endpoints import chat, users, careers, assessment
from app.utils.database import init_db

# Load environment variables
load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize database connection
    await init_db()
    print("✅ Database connected successfully")
    yield
    # Shutdown: Close database connection
    print("🔌 Closing database connection...")

# Create FastAPI app
app = FastAPI(
    title="AI Career Counsellor API",
    description="Backend API for AI-powered career counselling platform",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(careers.router, prefix="/api/careers", tags=["Careers"])
app.include_router(assessment.router, prefix="/api/assessment", tags=["Assessment"])

@app.get("/")
async def root():
    """Root endpoint - API status check"""
    return {
        "message": "AI Career Counsellor API",
        "status": "running",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "database": "connected"
    }

# WebSocket endpoint for real-time chat
@app.websocket("/ws/chat/{user_id}")
async def websocket_chat(websocket: WebSocket, user_id: str):
    """WebSocket endpoint for real-time chat communication"""
    await websocket.accept()
    print(f"WebSocket connection established for user: {user_id}")
    
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            
            # Process message (to be implemented with AI service)
            response = f"Echo: {data}"
            
            # Send response back to client
            await websocket.send_text(response)
            
    except WebSocketDisconnect:
        print(f"WebSocket connection closed for user: {user_id}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
