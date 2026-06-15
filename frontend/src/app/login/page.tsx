"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GraduationCap, Mail, Lock, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate login delay
    setTimeout(() => {
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      
      // Check if user exists
      const user = users.find(
        (u: any) => u.email === formData.email && u.password === formData.password
      );

      // Demo account
      const isDemoAccount = formData.email === "demo@student.com" && formData.password === "demo123";

      if (user || isDemoAccount) {
        // Save logged in user
        const loggedInUser = isDemoAccount 
          ? { id: "demo-123", name: "Demo Student", email: "demo@student.com" }
          : user;
        
        localStorage.setItem("currentUser", JSON.stringify(loggedInUser));
        localStorage.setItem("isLoggedIn", "true");
        
        // Redirect to chat
        router.push("/chat");
      } else {
        setError("Invalid email or password. Try demo@student.com / demo123");
      }
      
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <GraduationCap className="h-10 w-10 text-blue-600" />
            <span className="text-3xl font-bold text-gray-900">AI Career Counsellor</span>
          </Link>
          <p className="text-gray-600">Welcome back! Please login to continue.</p>
        </div>

        {/* Login Card */}
        <Card>
          <CardHeader>
            <CardTitle>Login to Your Account</CardTitle>
            <CardDescription>
              Enter your credentials to access your career guidance dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Alert */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="email"
                    required
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="password"
                    required
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>

              {/* Demo Account */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800 font-medium mb-1">✨ Demo Account (No signup needed!):</p>
                <p className="text-xs text-blue-700">Email: demo@student.com</p>
                <p className="text-xs text-blue-700">Password: demo123</p>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ email: "demo@student.com", password: "demo123" });
                  }}
                  className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Click to auto-fill demo credentials
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-semibold">
              Sign up for free
            </Link>
          </p>
        </div>

        {/* Or Continue as Guest */}
        <div className="mt-4 text-center">
          <Link href="/chat" className="text-sm text-gray-500 hover:text-gray-700">
            Continue as guest →
          </Link>
        </div>
      </div>
    </div>
  );
}