// User & Profile Types
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  createdAt: string;
  profile?: StudentProfile;
}

export interface StudentProfile {
  userId: string;
  grade: number;
  stream?: 'Science' | 'Commerce' | 'Arts';
  subjects: string[];
  interests: string[];
  academicPerformance: {
    grade10Percentage?: number;
    grade11Percentage?: number;
    grade12Percentage?: number;
  };
  preferredLanguage: 'en' | 'hi';
  location: {
    state: string;
    city: string;
  };
  aptitudeScore?: AptitudeResult;
}

// Chat Types
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: {
    careerSuggestions?: string[];
    resources?: Resource[];
  };
}

export interface ChatSession {
  id: string;
  userId: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

// Career Types
export interface Career {
  id: string;
  name: string;
  category: string;
  description: string;
  requiredEducation: string[];
  requiredSkills: string[];
  averageSalary: {
    min: number;
    max: number;
    currency: string;
  };
  jobOutlook: 'Excellent' | 'Good' | 'Fair' | 'Limited';
  topColleges: string[];
  relatedCareers: string[];
  certifications?: string[];
}

export interface CareerRecommendation {
  career: Career;
  matchScore: number;
  reasoning: string;
  requiredSteps: string[];
}

// Assessment Types
export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'rating' | 'text';
  options?: string[];
  category: 'logical' | 'verbal' | 'numerical' | 'spatial' | 'interest';
}

export interface Answer {
  questionId: string;
  answer: string | number;
  timeSpent?: number;
}

export interface AptitudeResult {
  overallScore: number;
  categoryScores: {
    logical: number;
    verbal: number;
    numerical: number;
    spatial: number;
    interest: number;
  };
  strengths: string[];
  weaknesses: string[];
  recommendedFields: string[];
  completedAt: string;
}

// Roadmap Types
export interface Milestone {
  id: string;
  title: string;
  description: string;
  timeframe: string;
  completed: boolean;
  resources: Resource[];
}

export interface CareerRoadmap {
  careerId: string;
  careerName: string;
  milestones: Milestone[];
  estimatedDuration: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

// Resource Types
export interface Resource {
  id: string;
  title: string;
  type: 'article' | 'video' | 'course' | 'book' | 'website';
  url: string;
  description: string;
  isFree: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Form Types
export interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  grade: number;
  stream?: 'Science' | 'Commerce' | 'Arts';
  subjects: string[];
  interests: string[];
  state: string;
  city: string;
  preferredLanguage: 'en' | 'hi';
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData extends LoginFormData {
  name: string;
  confirmPassword: string;
}
