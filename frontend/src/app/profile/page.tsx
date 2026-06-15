"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, MapPin, BookOpen, Heart, Loader2, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";

const STREAMS = ["Science", "Commerce", "Arts"];
const GRADES = [9, 10, 11, 12];

const SCIENCE_SUBJECTS = ["Physics", "Chemistry", "Mathematics", "Biology", "Computer Science"];
const COMMERCE_SUBJECTS = ["Accountancy", "Business Studies", "Economics", "Mathematics"];
const ARTS_SUBJECTS = ["History", "Political Science", "Economics", "Psychology", "Sociology"];

const COMMON_INTERESTS = [
  "Technology",
  "Medicine",
  "Business",
  "Design",
  "Research",
  "Teaching",
  "Sports",
  "Arts",
  "Social Work",
  "Engineering",
];

export default function ProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    grade: 11,
    stream: "",
    subjects: [] as string[],
    interests: [] as string[],
    state: "",
    city: "",
    grade10Percentage: "",
    grade11Percentage: "",
  });

  // Load existing profile on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem("studentProfile");
    const currentUser = localStorage.getItem("currentUser");
    
    if (savedProfile) {
      setFormData(JSON.parse(savedProfile));
    } else if (currentUser) {
      // If user is logged in, pre-fill name and email
      const user = JSON.parse(currentUser);
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, []);

  const getSubjectsByStream = () => {
    switch (formData.stream) {
      case "Science":
        return SCIENCE_SUBJECTS;
      case "Commerce":
        return COMMERCE_SUBJECTS;
      case "Arts":
        return ARTS_SUBJECTS;
      default:
        return [];
    }
  };

  const toggleSubject = (subject: string) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter((s) => s !== subject)
        : [...prev.subjects, subject],
    }));
  };

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Save profile to localStorage
    localStorage.setItem("studentProfile", JSON.stringify(formData));
    
    // Mark profile as completed
    localStorage.setItem("profileCompleted", "true");
    
    // Show success message
    setShowSuccess(true);

    // Wait 2 seconds then redirect to roadmap
    setTimeout(() => {
      setIsLoading(false);
      router.push("/roadmap");
    }, 2000);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh] p-4">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Saved! 🎉</h2>
                <p className="text-gray-600 mb-4">
                  Your profile has been saved successfully. Generating personalized roadmap...
                </p>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <Navbar />

      {/* Form Container */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-blue-600" />
              Create Your Profile
            </CardTitle>
            <CardDescription>
              Tell us about yourself so we can provide personalized career guidance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Basic Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Academic Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Current Grade</label>
                    <select
                      required
                      value={formData.grade}
                      onChange={(e) => setFormData({ ...formData, grade: Number(e.target.value) })}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                    >
                      {GRADES.map((grade) => (
                        <option key={grade} value={grade}>
                          Grade {grade}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Stream</label>
                    <select
                      required
                      value={formData.stream}
                      onChange={(e) =>
                        setFormData({ ...formData, stream: e.target.value, subjects: [] })
                      }
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                    >
                      <option value="">Select Stream</option>
                      {STREAMS.map((stream) => (
                        <option key={stream} value={stream}>
                          {stream}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {formData.stream && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Subjects (Select all that apply)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {getSubjectsByStream().map((subject) => (
                        <button
                          key={subject}
                          type="button"
                          onClick={() => toggleSubject(subject)}
                          className={`px-4 py-2 rounded-full text-sm transition-colors ${
                            formData.subjects.includes(subject)
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {subject}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Grade 10 Percentage (if completed)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={formData.grade10Percentage}
                      onChange={(e) =>
                        setFormData({ ...formData, grade10Percentage: e.target.value })
                      }
                      placeholder="85.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Grade 11 Percentage (if applicable)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={formData.grade11Percentage}
                      onChange={(e) =>
                        setFormData({ ...formData, grade11Percentage: e.target.value })
                      }
                      placeholder="82.0"
                    />
                  </div>
                </div>
              </div>

              {/* Interests */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Your Interests
                </h3>
                <div className="flex flex-wrap gap-2">
                  {COMMON_INTERESTS.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-4 py-2 rounded-full text-sm transition-colors ${
                        formData.interests.includes(interest)
                          ? "bg-purple-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Location
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">State</label>
                    <Input
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="Maharashtra"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">City</label>
                    <Input
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Mumbai"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving Profile...
                    </>
                  ) : (
                    "Save Profile & View Roadmap"
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.push("/")}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}