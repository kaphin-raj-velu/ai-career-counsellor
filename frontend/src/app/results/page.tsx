"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, TrendingUp, Brain, Target, CheckCircle, ArrowRight } from "lucide-react";

interface AssessmentResult {
  result_id: string;
  overall_score: number;
  category_scores: {
    logical: number;
    verbal: number;
    numerical: number;
    spatial: number;
    interest: number;
  };
  strengths: string[];
  weaknesses: string[];
  recommended_fields: string[];
}

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get results from localStorage
    const savedResult = localStorage.getItem("assessmentResult");
    if (savedResult) {
      try {
        const parsed = JSON.parse(savedResult);
        setResult(parsed);
      } catch (error) {
        console.error("Error parsing results:", error);
      }
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-white p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle>No Results Found</CardTitle>
            <CardDescription>
              Please take the assessment first to see your results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/assessment")} className="w-full">
              Take Assessment
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    return "text-orange-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Average";
    return "Needs Improvement";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Assessment Results</h1>
            <nav className="flex gap-4">
              <a href="/" className="text-gray-600 hover:text-gray-900">Home</a>
              <a href="/chat" className="text-gray-600 hover:text-gray-900">Chat</a>
              <a href="/roadmap" className="text-gray-600 hover:text-gray-900">Roadmap</a>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Success Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white text-center mb-8">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Assessment Complete! 🎉</h1>
          <p className="text-lg opacity-90">
            Here are your personalized results and career recommendations
          </p>
        </div>

        {/* Overall Score */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Your Overall Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className={`text-6xl font-bold mb-2 ${getScoreColor(result.overall_score)}`}>
                {Math.round(result.overall_score)}%
              </div>
              <p className="text-xl text-gray-600 mb-4">{getScoreLabel(result.overall_score)}</p>
              <div className="w-full bg-gray-200 rounded-full h-3 max-w-md mx-auto">
                <div
                  className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${result.overall_score}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Category Scores */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                Category Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(result.category_scores).map(([category, score]) => (
                <div key={category}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium capitalize">{category}</span>
                    <span className={`text-sm font-bold ${getScoreColor(score)}`}>
                      {Math.round(score)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Strengths & Weaknesses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Your Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-green-600 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Strengths
                </h4>
                <ul className="space-y-1">
                  {result.strengths.map((strength, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
              {result.weaknesses.length > 0 && (
                <div>
                  <h4 className="font-semibold text-orange-600 mb-2">Areas to Improve</h4>
                  <ul className="space-y-1">
                    {result.weaknesses.map((weakness, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-orange-600 mt-1">•</span>
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recommended Fields */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Recommended Career Fields
            </CardTitle>
            <CardDescription>
              Based on your assessment, these fields match your strengths
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {result.recommended_fields.map((field, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border-2 border-blue-200 hover:border-blue-400 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <h3 className="font-semibold text-gray-900">{field}</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Excellent match for your skills and interests
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
            <CardDescription>
              Continue your career exploration journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button
                onClick={() => router.push("/chat")}
                className="bg-blue-600 hover:bg-blue-700 w-full"
              >
                Chat with AI Counsellor
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                onClick={() => router.push("/roadmap")}
                variant="outline"
                className="w-full"
              >
                View Career Roadmap
              </Button>
              <Button
                onClick={() => router.push("/profile")}
                variant="outline"
                className="w-full"
              >
                Update Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}