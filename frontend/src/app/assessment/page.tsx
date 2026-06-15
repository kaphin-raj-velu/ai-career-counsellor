"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, CheckCircle2, ChevronRight, Loader2 } from "lucide-react";
import { assessmentAPI } from "@/lib/api";

interface Question {
  id: string;
  text: string;
  type: "multiple-choice" | "rating";
  options: string[];
  category: string;
}

// Simple Progress component (inline)
const ProgressBar = ({ value }: { value: number }) => (
  <div className="w-full bg-gray-200 rounded-full h-2">
    <div
      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
      style={{ width: `${value}%` }}
    />
  </div>
);

export default function AssessmentPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const userId = "demo-user-123";

  const startAssessment = async () => {
    setIsLoading(true);
    try {
      const data = await assessmentAPI.getQuestions();
      setQuestions(data);
      setHasStarted(true);
    } catch (error) {
      console.error("Error loading questions:", error);
      loadMockQuestions();
      setHasStarted(true);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMockQuestions = () => {
    const mockQuestions: Question[] = [
      {
        id: "q1",
        text: "If 5 workers can complete a task in 10 days, how many days will 10 workers take?",
        type: "multiple-choice",
        options: ["5 days", "10 days", "20 days", "2.5 days"],
        category: "logical",
      },
      {
        id: "q2",
        text: "Complete the series: 2, 6, 12, 20, 30, ?",
        type: "multiple-choice",
        options: ["40", "42", "44", "48"],
        category: "numerical",
      },
      {
        id: "q3",
        text: "I enjoy solving complex problems and puzzles",
        type: "rating",
        options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
        category: "interest",
      },
      {
        id: "q4",
        text: "What is 25% of 80?",
        type: "multiple-choice",
        options: ["15", "20", "25", "30"],
        category: "numerical",
      },
      {
        id: "q5",
        text: "I prefer working with people rather than data",
        type: "rating",
        options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
        category: "interest",
      },
      {
        id: "q6",
        text: "Find the odd one out: Triangle, Circle, Square, Rectangle",
        type: "multiple-choice",
        options: ["Triangle", "Circle", "Square", "Rectangle"],
        category: "spatial",
      },
      {
        id: "q7",
        text: "I am interested in understanding how things work",
        type: "rating",
        options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
        category: "interest",
      },
      {
        id: "q8",
        text: "Choose the correct analogy: Book is to Reading as Fork is to ?",
        type: "multiple-choice",
        options: ["Drawing", "Writing", "Eating", "Cutting"],
        category: "logical",
      },
      {
        id: "q9",
        text: "Choose the word most similar to 'Abundant'",
        type: "multiple-choice",
        options: ["Scarce", "Plentiful", "Rare", "Limited"],
        category: "verbal",
      },
      {
        id: "q10",
        text: "I enjoy creative and artistic activities",
        type: "rating",
        options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
        category: "interest",
      },
    ];
    setQuestions(mockQuestions);
  };

  const handleAnswer = (answer: string) => {
    setAnswers({
      ...answers,
      [questions[currentQuestion].id]: answer,
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer,
      }));

      const result = await assessmentAPI.submitAssessment(userId, formattedAnswers);
      
      // Save to localStorage
      localStorage.setItem("assessmentResult", JSON.stringify(result));
      
      // Redirect to results page
      router.push("/results");
    } catch (error) {
      console.error("Error submitting assessment:", error);
      
      // Create mock result if API fails
      const mockResult = {
        result_id: "mock-result-123",
        overall_score: 78,
        category_scores: {
          logical: 85,
          verbal: 72,
          numerical: 80,
          spatial: 75,
          interest: 88,
        },
        strengths: ["Logical Reasoning", "Problem Solving", "Analytical Thinking"],
        weaknesses: ["Verbal Communication"],
        recommended_fields: ["Engineering", "Computer Science", "Data Science"],
      };
      
      // Save mock result
      localStorage.setItem("assessmentResult", JSON.stringify(mockResult));
      
      // Still redirect to results
      router.push("/results");
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;
  const currentQ = questions[currentQuestion];

  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-purple-600" />
            </div>
            <CardTitle className="text-3xl">Aptitude Assessment</CardTitle>
            <CardDescription className="text-base">
              Discover your strengths and get personalized career recommendations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-4 space-y-2">
              <h3 className="font-semibold text-blue-900">What to expect:</h3>
              <ul className="space-y-1 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>10 questions covering logical, verbal, numerical, and spatial reasoning</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Takes approximately 10-15 minutes to complete</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Get instant results with career recommendations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>No negative marking - answer honestly</span>
                </li>
              </ul>
            </div>

            <Button
              onClick={startAssessment}
              disabled={isLoading}
              size="lg"
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Loading Questions...
                </>
              ) : (
                <>
                  Start Assessment
                  <ChevronRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>

            <p className="text-xs text-center text-gray-500">
              Your responses will be used to provide personalized career guidance
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentQ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-4">
      <div className="max-w-3xl mx-auto py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-gray-700">{Math.round(progress)}%</span>
          </div>
          <ProgressBar value={progress} />
        </div>

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-medium uppercase">
                {currentQ.category}
              </span>
            </div>
            <CardTitle className="text-xl">{currentQ.text}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    answers[currentQ.id] === option
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-200 hover:border-purple-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        answers[currentQ.id] === option
                          ? "border-purple-600 bg-purple-600"
                          : "border-gray-300"
                      }`}
                    >
                      {answers[currentQ.id] === option && (
                        <div className="w-3 h-3 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="flex-1">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            variant="outline"
            className="flex-1"
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={!answers[currentQ.id]}
            className="flex-1"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : currentQuestion === questions.length - 1 ? (
              "Submit Assessment"
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          You can go back to change your answers before submitting
        </p>
      </div>
    </div>
  );
}