# 🚀 Quick Start Guide

## Prerequisites Checklist
- [ ] Node.js 18+ installed
- [ ] Python 3.9+ installed
- [ ] MongoDB installed (or MongoDB Atlas account)
- [ ] OpenAI API Key or Anthropic API Key
- [ ] Git installed

## Step-by-Step Setup

### 1. Clone the Project
```bash
git clone <your-repo-url>
cd ai-career-counsellor
```

### 2. Backend Setup (5 minutes)

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env

# Edit .env and add your API keys:
# - OPENAI_API_KEY or ANTHROPIC_API_KEY
# - MONGODB_URL (use MongoDB Atlas if you don't have local MongoDB)

# Run the backend server
uvicorn app.main:app --reload --port 8000
```

Backend should now be running at: http://localhost:8000
API Documentation: http://localhost:8000/docs

### 3. Frontend Setup (5 minutes)

Open a new terminal:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install
# or
yarn install

# Setup environment variables
cp .env.example .env.local

# Edit .env.local if needed (default settings should work)

# Run development server
npm run dev
# or
yarn dev
```

Frontend should now be running at: http://localhost:3000

### 4. Database Setup

If using **MongoDB Atlas** (recommended for hackathon):
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Update MONGODB_URL in backend/.env

If using **Local MongoDB**:
```bash
# Install MongoDB Community Edition
# On Mac:
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Default connection: mongodb://localhost:27017
```

### 5. Get API Keys

**Option 1: OpenAI (Recommended)**
1. Go to https://platform.openai.com/api-keys
2. Create new API key
3. Add to backend/.env as OPENAI_API_KEY

**Option 2: Anthropic Claude**
1. Go to https://console.anthropic.com/
2. Create API key
3. Add to backend/.env as ANTHROPIC_API_KEY
4. Set AI_PROVIDER=anthropic in .env

## Testing the Setup

### Test Backend
```bash
# In backend directory
curl http://localhost:8000/health

# Expected response:
# {"status":"healthy","database":"connected"}
```

### Test Frontend
1. Open browser: http://localhost:3000
2. You should see the homepage
3. Click "Get Started" to test chat interface

## Common Issues & Solutions

### Issue: MongoDB Connection Error
**Solution**: Check if MongoDB is running
```bash
# For local MongoDB
brew services list  # Mac
sudo systemctl status mongod  # Linux

# Or use MongoDB Atlas cloud database
```

### Issue: Module not found (Python)
**Solution**: Make sure virtual environment is activated
```bash
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate     # Windows
pip install -r requirements.txt
```

### Issue: Module not found (Node)
**Solution**: Reinstall dependencies
```bash
rm -rf node_modules
npm install
```

### Issue: API Key Invalid
**Solution**: Check your .env file
- Make sure no spaces around =
- No quotes around the key
- Key should start with sk- for OpenAI

### Issue: Port already in use
**Solution**: Kill the process or use different port
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9  # Mac/Linux
netstat -ano | findstr :8000   # Windows (find PID, then kill)

# Or use different port
uvicorn app.main:app --reload --port 8001
```

## Development Workflow

### Making Changes

**Backend Changes:**
1. Edit files in `backend/app/`
2. Server auto-reloads (if using --reload flag)
3. Test at http://localhost:8000/docs

**Frontend Changes:**
1. Edit files in `frontend/src/`
2. Browser auto-refreshes
3. View at http://localhost:3000

### Adding New Features

**Add New API Endpoint:**
1. Create route in `backend/app/api/endpoints/`
2. Import in `backend/app/main.py`
3. Test in Swagger docs

**Add New Page:**
1. Create folder in `frontend/src/app/`
2. Add page.tsx file
3. Access at /your-page-name

## Deployment Checklist

### Before Deploying:
- [ ] Update CORS origins in backend
- [ ] Set strong SECRET_KEY in backend .env
- [ ] Set MONGODB_URL to production database
- [ ] Set NEXT_PUBLIC_API_URL to production backend URL
- [ ] Test all features locally
- [ ] Remove debug/console logs

### Deploy Backend (Railway/Render):
```bash
# Railway
railway up

# Render
# Connect GitHub repo and deploy
```

### Deploy Frontend (Vercel):
```bash
# Vercel
vercel

# Or connect GitHub repo in Vercel dashboard
```

## Useful Commands

```bash
# Backend
uvicorn app.main:app --reload          # Development
uvicorn app.main:app --host 0.0.0.0    # Production
pytest                                  # Run tests

# Frontend  
npm run dev                             # Development
npm run build                           # Build for production
npm run start                           # Run production build
npm run lint                            # Check code quality

# Database
mongosh                                 # MongoDB shell
```

## Next Steps

1. ✅ Setup complete? Start building!
2. 📚 Read API docs at http://localhost:8000/docs
3. 🎨 Customize UI in frontend/src/app/page.tsx
4. 🤖 Improve AI prompts in backend/app/services/ai_service.py
5. 📊 Add more careers in backend/app/data/careers.py

## Need Help?

- Check README.md for detailed information
- Review API documentation at /docs
- Test endpoints in Swagger UI
- Contact team members for support

**Good luck with your hackathon! 🎉**
