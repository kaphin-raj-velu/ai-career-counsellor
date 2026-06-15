# 📁 Project Architecture

## Complete File Structure

```
ai-career-counsellor/
│
├── README.md                          # Main documentation
├── SETUP_GUIDE.md                     # Quick start guide
├── .gitignore                         # Git ignore rules
│
├── frontend/                          # Next.js Frontend Application
│   ├── package.json                   # Frontend dependencies
│   ├── tsconfig.json                  # TypeScript configuration
│   ├── next.config.js                 # Next.js configuration
│   ├── tailwind.config.ts             # Tailwind CSS configuration
│   ├── postcss.config.js              # PostCSS configuration
│   ├── .env.example                   # Environment variables template
│   │
│   ├── public/                        # Static assets
│   │   └── (images, icons, etc.)
│   │
│   └── src/                           # Source code
│       ├── app/                       # Next.js 14 App Router
│       │   ├── layout.tsx             # Root layout
│       │   ├── page.tsx               # Home page
│       │   ├── globals.css            # Global styles
│       │   │
│       │   ├── chat/                  # Chat interface
│       │   │   └── page.tsx           # Chat page
│       │   │
│       │   ├── profile/               # Student profile
│       │   │   └── page.tsx           # Profile page
│       │   │
│       │   ├── roadmap/               # Career roadmap
│       │   │   └── page.tsx           # Roadmap page
│       │   │
│       │   └── api/                   # API routes (if needed)
│       │       └── (optional routes)
│       │
│       ├── components/                # React components
│       │   ├── ui/                    # shadcn/ui components
│       │   │   ├── button.tsx
│       │   │   ├── card.tsx
│       │   │   ├── input.tsx
│       │   │   └── (other UI components)
│       │   │
│       │   ├── chat/                  # Chat components
│       │   │   ├── ChatInterface.tsx
│       │   │   ├── MessageBubble.tsx
│       │   │   └── ChatInput.tsx
│       │   │
│       │   ├── profile/               # Profile components
│       │   │   ├── ProfileForm.tsx
│       │   │   └── AptitudeTest.tsx
│       │   │
│       │   └── dashboard/             # Dashboard components
│       │       ├── StatsCard.tsx
│       │       └── RecommendationCard.tsx
│       │
│       ├── lib/                       # Utilities and configurations
│       │   ├── api.ts                 # API client
│       │   ├── utils.ts               # Utility functions
│       │   └── constants.ts           # Constants
│       │
│       ├── types/                     # TypeScript type definitions
│       │   └── index.ts               # All types
│       │
│       ├── hooks/                     # Custom React hooks
│       │   ├── useChat.ts
│       │   ├── useProfile.ts
│       │   └── useAuth.ts
│       │
│       └── data/                      # Static data
│           ├── subjects.ts
│           └── streams.ts
│
├── backend/                           # FastAPI Backend Application
│   ├── requirements.txt               # Python dependencies
│   ├── .env.example                   # Environment variables template
│   │
│   ├── app/                           # Application code
│   │   ├── main.py                    # FastAPI app entry point
│   │   │
│   │   ├── api/                       # API routes
│   │   │   ├── endpoints/             # Route handlers
│   │   │   │   ├── users.py           # User management endpoints
│   │   │   │   ├── chat.py            # Chat endpoints
│   │   │   │   ├── careers.py         # Career endpoints
│   │   │   │   └── assessment.py      # Assessment endpoints
│   │   │   │
│   │   │   └── deps.py                # Dependencies (auth, etc.)
│   │   │
│   │   ├── models/                    # Database models (Beanie ODM)
│   │   │   ├── user.py                # User model
│   │   │   ├── profile.py             # Student profile model
│   │   │   ├── chat.py                # Chat session model
│   │   │   └── assessment.py          # Assessment result model
│   │   │
│   │   ├── services/                  # Business logic
│   │   │   ├── ai_service.py          # AI/LLM integration
│   │   │   ├── career_service.py      # Career recommendations
│   │   │   └── user_service.py        # User management
│   │   │
│   │   ├── utils/                     # Helper functions
│   │   │   ├── database.py            # Database connection
│   │   │   ├── auth.py                # Authentication utilities
│   │   │   └── validators.py          # Data validators
│   │   │
│   │   └── data/                      # Static data & resources
│   │       ├── careers.py             # Career database
│   │       ├── colleges.py            # College information
│   │       └── questions.py           # Assessment questions
│   │
│   └── tests/                         # Unit tests
│       ├── test_users.py
│       ├── test_chat.py
│       └── test_careers.py
│
└── docs/                              # Additional documentation
    ├── API.md                         # API documentation
    ├── DEPLOYMENT.md                  # Deployment guide
    └── CONTRIBUTING.md                # Contribution guidelines
```

## Component Architecture

### Frontend Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Browser                          │
├─────────────────────────────────────────────────────┤
│              Next.js Frontend (React)               │
│  ┌─────────────────────────────────────────────┐   │
│  │  Pages (App Router)                         │   │
│  │  - Home                                      │   │
│  │  - Chat Interface                            │   │
│  │  - Profile Management                        │   │
│  │  - Career Roadmap                            │   │
│  └─────────────────────────────────────────────┘   │
│                      ▼                              │
│  ┌─────────────────────────────────────────────┐   │
│  │  Components Layer                           │   │
│  │  - UI Components (shadcn/ui)                │   │
│  │  - Chat Components                          │   │
│  │  - Profile Components                       │   │
│  └─────────────────────────────────────────────┘   │
│                      ▼                              │
│  ┌─────────────────────────────────────────────┐   │
│  │  State Management                           │   │
│  │  - React Hooks                              │   │
│  │  - Context API                              │   │
│  └─────────────────────────────────────────────┘   │
│                      ▼                              │
│  ┌─────────────────────────────────────────────┐   │
│  │  API Client (Axios/Fetch)                   │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                       │
                       │ HTTP/WebSocket
                       ▼
┌─────────────────────────────────────────────────────┐
│              FastAPI Backend (Python)               │
│  ┌─────────────────────────────────────────────┐   │
│  │  API Endpoints                              │   │
│  │  - /api/users                               │   │
│  │  - /api/chat                                │   │
│  │  - /api/careers                             │   │
│  │  - /api/assessment                          │   │
│  └─────────────────────────────────────────────┘   │
│                      ▼                              │
│  ┌─────────────────────────────────────────────┐   │
│  │  Services Layer                             │   │
│  │  - AI Service (OpenAI/Claude)               │   │
│  │  - Career Service                           │   │
│  │  - User Service                             │   │
│  └─────────────────────────────────────────────┘   │
│                      ▼                              │
│  ┌─────────────────────────────────────────────┐   │
│  │  Database Layer (Beanie ODM)                │   │
│  │  - User Model                               │   │
│  │  - Profile Model                            │   │
│  │  - Chat Model                               │   │
│  │  - Assessment Model                         │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│              MongoDB Database                       │
│  - users                                            │
│  - student_profiles                                 │
│  - chat_sessions                                    │
│  - assessment_results                               │
└─────────────────────────────────────────────────────┘
```

## Data Flow

### User Registration Flow
```
User → Frontend Form → POST /api/users/register → 
Backend Validation → Hash Password → Save to MongoDB → 
Generate JWT Token → Return to Frontend → Store Token → 
Redirect to Profile Creation
```

### Chat Flow
```
User Message → Frontend → POST /api/chat/message →
Backend → Get User Profile → Build AI Context →
Call OpenAI/Claude API → Get Response →
Save to Chat Session → Return to Frontend →
Display in Chat Interface
```

### Career Recommendation Flow
```
User Profile → Frontend → POST /api/careers/recommendations →
Backend → Analyze Profile (Stream, Interests, Scores) →
Match with Career Database → Calculate Match Scores →
Sort by Relevance → Return Top 5 → Display to User
```

## Technology Stack Details

### Frontend Stack
- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Library**: shadcn/ui (Radix UI primitives)
- **State Management**: React Hooks + Context
- **API Client**: Axios
- **Charts**: Recharts
- **Animations**: Framer Motion

### Backend Stack
- **Framework**: FastAPI
- **Language**: Python 3.9+
- **AI**: OpenAI GPT-4 / Anthropic Claude
- **Database**: MongoDB (Motor async driver)
- **ODM**: Beanie
- **Auth**: JWT (python-jose)
- **Password**: Passlib (bcrypt)
- **Validation**: Pydantic

### Database Schema

**Users Collection**
```json
{
  "_id": "ObjectId",
  "email": "string (unique)",
  "name": "string",
  "hashed_password": "string",
  "phone": "string",
  "is_active": "boolean",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

**Student Profiles Collection**
```json
{
  "_id": "ObjectId",
  "user_id": "string (unique)",
  "grade": "integer (9-12)",
  "stream": "enum (Science/Commerce/Arts)",
  "subjects": ["array of strings"],
  "interests": ["array of strings"],
  "academic_performance": {
    "grade10_percentage": "float",
    "grade11_percentage": "float",
    "grade12_percentage": "float"
  },
  "location": {
    "state": "string",
    "city": "string"
  },
  "aptitude_completed": "boolean",
  "aptitude_result_id": "string"
}
```

**Chat Sessions Collection**
```json
{
  "_id": "ObjectId",
  "user_id": "string",
  "messages": [
    {
      "role": "enum (user/assistant/system)",
      "content": "string",
      "timestamp": "datetime",
      "metadata": "object"
    }
  ],
  "session_type": "string",
  "is_active": "boolean",
  "created_at": "datetime"
}
```

**Assessment Results Collection**
```json
{
  "_id": "ObjectId",
  "user_id": "string",
  "overall_score": "float (0-100)",
  "category_scores": {
    "logical": "float",
    "verbal": "float",
    "numerical": "float",
    "spatial": "float",
    "interest": "float"
  },
  "strengths": ["array of strings"],
  "weaknesses": ["array of strings"],
  "recommended_fields": ["array of strings"],
  "completed_at": "datetime"
}
```

## Development Guidelines

### Code Style
- **Frontend**: ESLint + Prettier
- **Backend**: Black + Flake8
- **Naming**: camelCase (Frontend), snake_case (Backend)

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/chat-interface

# Make changes and commit
git add .
git commit -m "feat: add chat interface"

# Push and create PR
git push origin feature/chat-interface
```

### Testing Strategy
- **Unit Tests**: Individual functions
- **Integration Tests**: API endpoints
- **E2E Tests**: User flows (optional)

## Scalability Considerations

### Current Setup (MVP)
- Single server deployment
- Suitable for 100-1000 concurrent users
- Local/Atlas MongoDB

### Future Scaling Options
1. **Horizontal Scaling**: Multiple backend instances with load balancer
2. **Caching**: Redis for session/chat caching
3. **CDN**: Static asset delivery
4. **Database**: MongoDB Sharding
5. **AI**: Queue system for AI requests

This architecture provides a solid foundation for your hackathon project while remaining scalable for future growth!
