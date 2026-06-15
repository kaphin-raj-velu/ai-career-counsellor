"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Clock, BookOpen, Target, Award, TrendingUp, User, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import { formatCurrency } from "@/lib/utils";

interface StudentProfile {
  name: string;
  email: string;
  grade: number;
  stream: string;
  subjects: string[];
  interests: string[];
  state: string;
  city: string;
  grade10Percentage: string;
  grade11Percentage: string;
}

interface Career {
  id: string;
  name: string;
  category: string;
  description: string;
  required_education: string[];
  required_skills: string[];
  average_salary: {
    min: number;
    max: number;
  };
  job_outlook: string;
  top_colleges: string[];
  entrance_exams: string[];
}

interface CareerRecommendation {
  career: Career;
  match_score: number;
  reasoning: string;
}

export default function RoadmapPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfileAndRecommendations();
  }, []);

  const loadProfileAndRecommendations = () => {
    const savedProfile = localStorage.getItem("studentProfile");
    
    if (!savedProfile) {
      setIsLoading(false);
      return;
    }

    const profileData: StudentProfile = JSON.parse(savedProfile);
    setProfile(profileData);

    // Generate recommendations based on profile
    const recs = generateRecommendations(profileData);
    setRecommendations(recs);
    
    if (recs.length > 0) {
      setSelectedCareer(recs[0].career);
    }
    
    setIsLoading(false);
  };

  const generateRecommendations = (profile: StudentProfile): CareerRecommendation[] => {
    // Career database
    const careerDatabase: Career[] = [
      {
        id: "cs_engineering",
        name: "Computer Science Engineering",
        category: "Engineering",
        description: "Design and develop software, applications, and computer systems",
        required_education: ["B.Tech/B.E in Computer Science", "JEE Main/Advanced"],
        required_skills: ["Programming", "Problem Solving", "Mathematics", "Logical Thinking"],
        average_salary: { min: 400000, max: 2000000 },
        job_outlook: "Excellent",
        top_colleges: ["IIT Delhi", "IIT Bombay", "BITS Pilani", "NIT Trichy"],
        entrance_exams: ["JEE Main", "JEE Advanced", "BITSAT"],
      },
      {
        id: "medicine",
        name: "Medicine (MBBS)",
        category: "Medical",
        description: "Become a medical doctor and treat patients",
        required_education: ["MBBS", "NEET UG"],
        required_skills: ["Biology", "Chemistry", "Empathy", "Critical Thinking"],
        average_salary: { min: 600000, max: 3000000 },
        job_outlook: "Excellent",
        top_colleges: ["AIIMS Delhi", "CMC Vellore", "JIPMER", "MAMC Delhi"],
        entrance_exams: ["NEET UG"],
      },
      {
        id: "data_science",
        name: "Data Science",
        category: "Technology",
        description: "Analyze data to extract insights and build predictive models",
        required_education: ["B.Tech/M.Tech or Statistics degree"],
        required_skills: ["Python", "Statistics", "Machine Learning", "SQL"],
        average_salary: { min: 600000, max: 2500000 },
        job_outlook: "Excellent",
        top_colleges: ["IIT Madras", "ISI Kolkata", "IIT Delhi"],
        entrance_exams: ["JEE Advanced", "GATE"],
      },
      {
        id: "ca",
        name: "Chartered Accountancy",
        category: "Commerce",
        description: "Manage finances, auditing, and taxation for businesses",
        required_education: ["CA Foundation", "CA Intermediate", "CA Final"],
        required_skills: ["Accounting", "Taxation", "Financial Analysis", "Attention to Detail"],
        average_salary: { min: 700000, max: 2500000 },
        job_outlook: "Very Good",
        top_colleges: ["ICAI"],
        entrance_exams: ["CA Foundation Exam"],
      },
      {
        id: "psychology",
        name: "Psychology",
        category: "Arts & Sciences",
        description: "Study human behavior and mental processes",
        required_education: ["BA/BSc in Psychology"],
        required_skills: ["Empathy", "Communication", "Research", "Critical Thinking"],
        average_salary: { min: 300000, max: 1200000 },
        job_outlook: "Good",
        top_colleges: ["Delhi University", "TISS Mumbai", "Christ University"],
        entrance_exams: ["University Entrance Exams"],
      },
      {
        id: "law",
        name: "Law (LLB)",
        category: "Arts & Humanities",
        description: "Practice law and represent clients in legal matters",
        required_education: ["BA LLB / BBA LLB"],
        required_skills: ["Critical Thinking", "Communication", "Research", "Argumentation"],
        average_salary: { min: 400000, max: 2000000 },
        job_outlook: "Very Good",
        top_colleges: ["NLSIU Bangalore", "NALSAR Hyderabad", "NLU Delhi"],
        entrance_exams: ["CLAT"],
      },
    ];

    // Recommendation logic based on stream
    const streamCareerMap: Record<string, string[]> = {
      Science: ["cs_engineering", "medicine", "data_science"],
      Commerce: ["ca", "data_science"],
      Arts: ["psychology", "law"],
    };

    const relevantCareerIds = streamCareerMap[profile.stream] || [];
    const scored: CareerRecommendation[] = [];

    careerDatabase.forEach((career) => {
      let score = 0;
      let reasons: string[] = [];

      // Stream match
      if (relevantCareerIds.includes(career.id)) {
        score += 40;
        reasons.push(`Aligns with your ${profile.stream} stream`);
      }

      // Interest match
      profile.interests.forEach((interest) => {
        if (career.name.toLowerCase().includes(interest.toLowerCase()) ||
            career.description.toLowerCase().includes(interest.toLowerCase())) {
          score += 15;
          reasons.push(`Matches your interest in ${interest}`);
        }
      });

      // Subject match
      profile.subjects.forEach((subject) => {
        if (career.required_skills.some(skill => 
          skill.toLowerCase().includes(subject.toLowerCase())
        )) {
          score += 10;
          reasons.push(`Your ${subject} background is valuable`);
        }
      });

      if (score > 30) {
        scored.push({
          career,
          match_score: Math.min(score, 100),
          reasoning: reasons.slice(0, 3).join(". ") + ".",
        });
      }
    });

    // Sort by score
    scored.sort((a, b) => b.match_score - a.match_score);
    
    return scored.slice(0, 5);
  };

  const roadmapSteps = selectedCareer
    ? [
        {
          title: `Grade ${profile?.grade || 11}-12 (Current)`,
          icon: BookOpen,
          tasks: [
            `Focus on ${selectedCareer.required_skills.slice(0, 3).join(", ")}`,
            "Maintain good academic performance (target 75%+)",
            "Start preparing for entrance exams",
          ],
          duration: "1-2 years",
        },
        {
          title: "Entrance Exams",
          icon: Award,
          tasks: selectedCareer.entrance_exams.map((exam) => `Prepare for ${exam}`),
          duration: "6-12 months",
        },
        {
          title: "Higher Education",
          icon: Target,
          tasks: [
            selectedCareer.required_education[0],
            `Target colleges: ${selectedCareer.top_colleges.slice(0, 2).join(", ")}`,
            "Build strong foundation in core subjects",
          ],
          duration: "3-5 years",
        },
        {
          title: "Career Launch",
          icon: TrendingUp,
          tasks: [
            "Gain practical experience through internships",
            "Work on projects and build portfolio",
            "Network with industry professionals",
          ],
          duration: "Ongoing",
        },
      ]
    : [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your personalized roadmap...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh] p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <User className="w-12 h-12 text-blue-600 mx-auto mb-2" />
              <CardTitle>No Profile Found</CardTitle>
              <CardDescription>
                Please complete your profile to see personalized career recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push("/profile")} className="w-full">
                Complete Your Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Profile Summary */}
        <Card className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-6 h-6" />
              Your Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="opacity-90">Name</p>
                <p className="font-semibold">{profile.name}</p>
              </div>
              <div>
                <p className="opacity-90">Grade & Stream</p>
                <p className="font-semibold">Grade {profile.grade} - {profile.stream}</p>
              </div>
              <div>
                <p className="opacity-90">Location</p>
                <p className="font-semibold">{profile.city}, {profile.state}</p>
              </div>
              <div>
                <p className="opacity-90">Interests</p>
                <p className="font-semibold">{profile.interests.slice(0, 2).join(", ")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Career Recommendations Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xl font-bold">Your Top Matches</h2>
            {recommendations.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-600">No recommendations yet. Update your profile to get personalized suggestions.</p>
                </CardContent>
              </Card>
            ) : (
              recommendations.map((rec) => (
                <Card
                  key={rec.career.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedCareer?.id === rec.career.id
                      ? "border-blue-600 border-2"
                      : ""
                  }`}
                  onClick={() => setSelectedCareer(rec.career)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{rec.career.name}</CardTitle>
                        <CardDescription>{rec.career.category}</CardDescription>
                      </div>
                      <div className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-sm font-semibold">
                        {rec.match_score}%
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{rec.reasoning}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Career Details & Roadmap */}
          <div className="lg:col-span-2 space-y-6">
            {selectedCareer ? (
              <>
                {/* Career Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">{selectedCareer.name}</CardTitle>
                    <CardDescription>{selectedCareer.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Salary Range
                        </h4>
                        <p className="text-lg font-bold text-blue-600">
                          {formatCurrency(selectedCareer.average_salary.min)} -{" "}
                          {formatCurrency(selectedCareer.average_salary.max)}
                        </p>
                        <p className="text-sm text-gray-600">per year</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Job Outlook</h4>
                        <p
                          className={`text-lg font-bold ${
                            selectedCareer.job_outlook === "Excellent"
                              ? "text-green-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {selectedCareer.job_outlook}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Required Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCareer.required_skills.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Top Colleges</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCareer.top_colleges.map((college, index) => (
                          <span
                            key={index}
                            className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
                          >
                            {college}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Roadmap Steps */}
                <Card>
                  <CardHeader>
                    <CardTitle>Your Career Roadmap</CardTitle>
                    <CardDescription>
                      Personalized path based on your profile
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {roadmapSteps.map((step, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                              <step.icon className="w-5 h-5" />
                            </div>
                            {index < roadmapSteps.length - 1 && (
                              <div className="w-0.5 h-full bg-blue-200 my-2" />
                            )}
                          </div>
                          <div className="flex-1 pb-6">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-lg">{step.title}</h3>
                              <span className="flex items-center gap-1 text-sm text-gray-600">
                                <Clock className="w-4 h-4" />
                                {step.duration}
                              </span>
                            </div>
                            <ul className="space-y-2">
                              {step.tasks.map((task, taskIndex) => (
                                <li key={taskIndex} className="flex items-start gap-2 text-gray-700">
                                  <Check className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                                  <span>{task}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-900">
                        💡 <strong>Personalized for you:</strong> This roadmap is based on your Grade {profile.grade}, {profile.stream} stream, and interests in {profile.interests.slice(0, 2).join(" & ")}.
                      </p>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Button onClick={() => router.push("/chat")} className="flex-1">
                        Chat with AI Counsellor
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                      <Button variant="outline" onClick={() => router.push("/profile")}>
                        Update Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}