# 🎓 AI-Powered Career Counsellor Chatbot

**An intelligent career guidance platform for Indian high school students (Grades 9-12)**

Built by Team 48 for Hackathon

## 🚀 Features

- 🤖 **AI-Powered Chatbot** - Personalized career guidance using advanced AI
- 📊 **Aptitude Assessment** - Quick 10-question test to evaluate student strengths
- 🎯 **Career Recommendations** - Data-driven suggestions based on interests and performance
- 🗺️ **Career Roadmap** - Step-by-step guidance for chosen career paths
- 📚 **Course Database** - Integration with verified educational resources
- 🌐 **Bilingual Support** - English and Hindi support
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (React)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Hooks + Context API
- **Charts**: Recharts

### Backend
- **Framework**: FastAPI (Python)
- **AI**: OpenAI GPT-4 / Anthropic Claude
- **Database**: MongoDB
- **Authentication**: JWT
- **WebSocket**: For real-time chat

## 📁 Project Structure

```
ai-career-counsellor/
├── frontend/                 # Next.js Frontend
│   ├── src/
│   │   ├── app/             # Next.js 14 App Router
│   │   │   ├── page.tsx     # Home page
│   │   │   ├── chat/        # Chat interface
│   │   │   ├── profile/     # Student profile
│   │   │   └── roadmap/     # Career roadmap
│   │   ├── components/      # React components
│   │   │   ├── ui/          # shadcn/ui components
│   │   │   ├── chat/        # Chat components
│   │   │   ├── profile/     # Profile components
│   │   │   └── dashboard/   # Dashboard components
│   │   ├── lib/             # Utilities and configs
│   │   ├── types/           # TypeScript types
│   │   ├── hooks/           # Custom React hooks
│   │   └── data/            # Static data
│   ├── public/              # Static assets
│   └── package.json
│
├── backend/                  # FastAPI Backend
│   ├── app/
│   │   ├── main.py          # FastAPI app entry
│   │   ├── api/             # API routes
│   │   │   ├── endpoints/   # Route handlers
│   │   │   └── deps.py      # Dependencies
│   │   ├── models/          # Database models
│   │   ├── services/        # Business logic
│   │   │   ├── ai_service.py
│   │   │   ├── career_service.py
│   │   │   └── user_service.py
│   │   ├── utils/           # Helper functions
│   │   └── data/            # Career data, courses
│   ├── tests/               # Unit tests
│   └── requirements.txt
│
└── README.md                # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Python 3.9+
- MongoDB (local or Atlas)
- OpenAI API Key or Anthropic API Key

### 1. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd ai-career-counsellor
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Add your API keys and MongoDB URL

# Run the server
uvicorn app.main:app --reload --port 8000
```

Backend will run at: http://localhost:8000

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
# or
yarn install

# Create .env.local file
cp .env.example .env.local
# Add your environment variables

# Run development server
npm run dev
# or
yarn dev
```

Frontend will run at: http://localhost:3000

## 🔑 Environment Variables

### Backend (.env)
```env
OPENAI_API_KEY=your_openai_key_here
# OR
ANTHROPIC_API_KEY=your_anthropic_key_here

MONGODB_URL=mongodb://localhost:27017/career_counsellor
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=AI Career Counsellor
```

## 📱 Usage

1. **Create Profile**: Students create their profile with academic details and interests
2. **Take Assessment**: Complete a quick aptitude assessment
3. **Chat with AI**: Get personalized career guidance through the chatbot
4. **View Recommendations**: See AI-generated career recommendations
5. **Explore Roadmap**: View detailed career paths and required steps

## 🎯 API Endpoints

### User Management
- `POST /api/users/register` - Register new student
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile

### Chat
- `POST /api/chat/message` - Send message to AI
- `GET /api/chat/history` - Get chat history
- `WebSocket /ws/chat` - Real-time chat connection

### Career Services
- `GET /api/careers/recommendations` - Get career recommendations
- `GET /api/careers/details/{career_id}` - Get career details
- `POST /api/assessment/submit` - Submit aptitude test

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📦 Deployment

### Backend (Railway/Render)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

### Frontend (Vercel)
1. Import GitHub repository
2. Set environment variables
3. Deploy automatically



## 📄 License

MIT License - feel free to use for educational purposes

## 🙏 Acknowledgments

- OpenAI/Anthropic for AI capabilities
- shadcn/ui for beautiful components
- Indian education system data sources

## 📞 Support

For questions or issues, please contact the team or create an issue in the repository.

---

**Built with ❤️ for Indian Students**

LIVE DEMO:https://drive.google.com/file/d/1yCLGh2WEVxfPmakRZL_CvXr59Fs5yCpN/view
