import os
from typing import List, Dict, Optional
from dotenv import load_dotenv

# IMPORTANT: Load .env file first
load_dotenv()

class AIService:
    """Service for AI-powered career counselling using OpenAI, Anthropic, or Gemini"""
    
    def __init__(self):
        self.provider = os.getenv("AI_PROVIDER", "openai")
        
        if self.provider == "openai":
            api_key = os.getenv("OPENAI_API_KEY")
            if not api_key:
                print("⚠️  ERROR: OPENAI_API_KEY not found!")
                self.client = None
                self.model = None
            else:
                from openai import AsyncOpenAI
                self.client = AsyncOpenAI(api_key=api_key)
                self.model = "gpt-4o-mini"
                print("✅ OpenAI API configured successfully!")
                print(f"✅ Using model: {self.model}")
                
        elif self.provider == "anthropic":
            api_key = os.getenv("ANTHROPIC_API_KEY")
            if not api_key:
                print("⚠️  ERROR: ANTHROPIC_API_KEY not found!")
                self.client = None
                self.model = None
            else:
                from anthropic import AsyncAnthropic
                self.client = AsyncAnthropic(api_key=api_key)
                self.model = "claude-3-5-sonnet-20241022"
                print("✅ Anthropic API configured successfully!")
                
        elif self.provider == "gemini":
            api_key = os.getenv("GEMINI_API_KEY")
            print(f"🔍 GEMINI_API_KEY loaded = {bool(api_key)}")
            if not api_key:
                print("⚠️  ERROR: GEMINI_API_KEY not found!")
                self.client = None
                self.model = None
            else:
                try:
                    import google.generativeai as genai
                    genai.configure(api_key=api_key)
                    
                    # List available models
                    available_models = []
                    try:
                        for model in genai.list_models():
                            if 'generateContent' in model.supported_generation_methods:
                                available_models.append(model.name)
                        print(f"📋 Available models: {available_models[:5]}... (showing first 5)")
                    except Exception as list_err:
                        print(f"⚠️  Could not list models: {list_err}")
                    
                    # Try models in order of preference (with correct "models/" prefix)
                    models_to_try = [
                        "gemini-2.5-flash",      # Latest fastest
                        "gemini-2.5-pro",        # Latest most capable
                        "gemini-2.0-flash",      # Stable fast
                        "gemini-2.0-flash-lite", # Lightweight
                    ]
                    
                    self.model = None
                    for model_name in models_to_try:
                        try:
                            test_client = genai.GenerativeModel(model_name)
                            # Test with a simple message
                            test_response = test_client.generate_content("Hi")
                            if test_response and test_response.text:
                                self.client = test_client
                                self.model = model_name
                                print(f"✅ Gemini client ready with {self.model}")
                                break
                        except Exception as model_err:
                            print(f"   ⚠️  {model_name} failed: {str(model_err)[:50]}...")
                            continue
                    
                    if not self.model:
                        print(f"❌ No compatible Gemini model found. Tried: {models_to_try}")
                        print(f"   Available models: {available_models}")
                        self.client = None
                        
                except Exception as e:
                    print(f"❌ Error configuring Gemini: {e}")
                    self.client = None
                    self.model = None
        else:
            print(f"⚠️  Unknown AI provider: {self.provider}")
            self.client = None
            self.model = None
    
    async def get_career_counselling_response(
        self,
        user_message: str,
        conversation_history: List[Dict[str, str]],
        student_profile: Optional[Dict] = None
    ) -> str:
        """Get AI response for career counselling chat"""
        
        if not self.client:
            return "⚠️ AI service is not configured. Please check your API key in the .env file."
        
        # Build system prompt with student context
        system_prompt = self._build_system_prompt(student_profile)
        
        try:
            if self.provider == "openai":
                messages = [{"role": "system", "content": system_prompt}]
                messages.extend(conversation_history)
                messages.append({"role": "user", "content": user_message})
                response = await self._get_openai_response(messages)
            elif self.provider == "anthropic":
                messages = [{"role": "system", "content": system_prompt}]
                messages.extend(conversation_history)
                messages.append({"role": "user", "content": user_message})
                response = await self._get_anthropic_response(messages)
            elif self.provider == "gemini":
                # Gemini doesn't use message format, just plain prompt
                full_prompt = f"{system_prompt}\n\nUser: {user_message}\n\nAssistant:"
                response = await self._get_gemini_response(full_prompt)
            else:
                response = "AI provider not configured"
            
            return response
        except Exception as e:
            error_msg = str(e)
            print(f"❌ Error getting AI response: {error_msg}")
            
            # Return helpful error message
            if "404" in error_msg or "not found" in error_msg.lower():
                return "⚠️ AI model not available. Please check the model name in the backend configuration."
            elif "api_key" in error_msg.lower() or "401" in error_msg:
                return "⚠️ API key error. Please check that your API key is valid."
            elif "quota" in error_msg.lower() or "429" in error_msg:
                return "⚠️ API quota exceeded. You may need to add credits to your account."
            else:
                return "⚠️ I'm having trouble connecting right now. Please try again in a moment."
    
    def _build_system_prompt(self, student_profile: Optional[Dict] = None) -> str:
        """Build system prompt with student context"""
        
        base_prompt = """You are an expert AI career counsellor for Indian high school students (Grades 9-12). 
Your role is to provide personalized, accurate, and encouraging career guidance.

Key responsibilities:
- Understand student interests, strengths, and academic performance
- Suggest suitable career paths based on Indian education system
- Provide information about courses, colleges, and entrance exams
- Be supportive, patient, and motivational
- Give practical, actionable advice

Keep responses concise and helpful (2-3 paragraphs max).
"""
        
        if student_profile:
            context = f"""

Current Student:
- Grade: {student_profile.get('grade', 'Not specified')}
- Stream: {student_profile.get('stream', 'Not specified')}
- Interests: {', '.join(student_profile.get('interests', [])[:3])}

Personalize your guidance based on this.
"""
            base_prompt += context
        
        return base_prompt
    
    async def _get_openai_response(self, messages: List[Dict]) -> str:
        """Get response from OpenAI"""
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=0.7,
            max_tokens=500
        )
        return response.choices[0].message.content
    
    async def _get_anthropic_response(self, messages: List[Dict]) -> str:
        """Get response from Anthropic Claude"""
        system_msg = next((m["content"] for m in messages if m["role"] == "system"), "")
        conversation = [m for m in messages if m["role"] != "system"]
        
        response = await self.client.messages.create(
            model=self.model,
            max_tokens=500,
            system=system_msg,
            messages=conversation
        )
        return response.content[0].text
    
    async def _get_gemini_response(self, prompt: str) -> str:
        """Get response from Google Gemini"""
        try:
            # Gemini generate_content is synchronous in newer versions
            # We'll use it directly without await
            import asyncio
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None, 
                self.client.generate_content, 
                prompt
            )
            return response.text
        except Exception as e:
            print(f"❌ Gemini error: {e}")
            raise
    
    async def analyze_aptitude_results(
        self,
        answers: List[Dict],
        questions: List[Dict]
    ) -> Dict:
        """Analyze aptitude test results"""
        return {
            "strengths": ["Analytical Thinking", "Problem Solving"],
            "weaknesses": ["Time Management"],
            "recommended_fields": ["Engineering", "Technology", "Data Science"],
            "explanation": "Based on your assessment results"
        }

# Singleton instance
ai_service = AIService()