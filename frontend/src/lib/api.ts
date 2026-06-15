import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// User APIs
export const userAPI = {
  register: async (data: { email: string; name: string; password: string }) => {
    const response = await api.post('/api/users/register', data);
    return response.data;
  },
  
  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/api/users/login', data);
    return response.data;
  },
  
  getProfile: async (userId: string) => {
    const response = await api.get(`/api/users/profile?user_id=${userId}`);
    return response.data;
  },
};

// Chat APIs
export const chatAPI = {
  sendMessage: async (userId: string, message: string, sessionId?: string) => {
    const response = await api.post(`/api/chat/message?user_id=${userId}`, {
      message,
      session_id: sessionId,
    });
    return response.data;
  },
  
  getChatHistory: async (sessionId: string) => {
    const response = await api.get(`/api/chat/history/${sessionId}`);
    return response.data;
  },
  
  getSessions: async (userId: string) => {
    const response = await api.get(`/api/chat/sessions?user_id=${userId}`);
    return response.data;
  },
};

// Career APIs
export const careerAPI = {
  getAllCareers: async () => {
    const response = await api.get('/api/careers/all');
    return response.data;
  },
  
  getCareerDetails: async (careerId: string) => {
    const response = await api.get(`/api/careers/${careerId}`);
    return response.data;
  },
  
  getRecommendations: async (userId: string) => {
    const response = await api.post(`/api/careers/recommendations?user_id=${userId}`);
    return response.data;
  },
  
  searchCareers: async (query: string) => {
    const response = await api.get(`/api/careers/search/${query}`);
    return response.data;
  },
};

// Assessment APIs
export const assessmentAPI = {
  getQuestions: async () => {
    const response = await api.get('/api/assessment/questions');
    return response.data;
  },
  
  submitAssessment: async (userId: string, answers: any[]) => {
    const response = await api.post(`/api/assessment/submit?user_id=${userId}`, {
      answers,
    });
    return response.data;
  },
  
  getResults: async (resultId: string) => {
    const response = await api.get(`/api/assessment/results/${resultId}`);
    return response.data;
  },
};

export default api;
