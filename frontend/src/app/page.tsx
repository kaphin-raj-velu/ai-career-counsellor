import Link from "next/link";
import { ArrowRight, Bot, Brain, Target, Users, Zap, GraduationCap, ClipboardList } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Your AI-Powered Career Guide
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Personalized career counselling for Indian high school students. 
            Get expert guidance powered by AI, available 24/7.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href="/assessment"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/profile"
              className="bg-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <ClipboardList className="h-5 w-5" />
              Create Profile
            </Link>
            <Link
              href="/chat"
              className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Try AI Chat
            </Link>
          </div>
          
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
          Why Choose Our AI Counsellor?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Bot className="h-10 w-10" />}
            title="AI-Powered Guidance"
            description="Get intelligent career recommendations based on your interests, skills, and academic performance."
            link="/chat"
          />
          <FeatureCard
            icon={<Brain className="h-10 w-10" />}
            title="Aptitude Assessment"
            description="Take comprehensive tests to discover your strengths and ideal career paths."
            link="/assessment"
          />
          <FeatureCard
            icon={<Target className="h-10 w-10" />}
            title="Personalized Roadmap"
            description="Receive step-by-step guidance for your chosen career with courses and milestones."
            link="/roadmap"
          />
          <FeatureCard
            icon={<Zap className="h-10 w-10" />}
            title="24/7 Availability"
            description="Get instant answers to your career questions anytime, anywhere."
            link="/chat"
          />
          <FeatureCard
            icon={<Users className="h-10 w-10" />}
            title="Trusted by Thousands"
            description="Join students across India who've found their perfect career path."
            link="/profile"
          />
          <FeatureCard
            icon={<GraduationCap className="h-10 w-10" />}
            title="Updated Database"
            description="Access latest information on courses, colleges, and career opportunities."
            link="/roadmap"
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-20 bg-white/50 rounded-2xl">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
          How It Works
        </h2>
        <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          <StepCard
            number="1"
            title="Create Profile"
            description="Tell us about your interests, grade, and stream"
            link="/profile"
          />
          <StepCard
            number="2"
            title="Take Assessment"
            description="Complete our aptitude test to discover your strengths"
            link="/assessment"
          />
          <StepCard
            number="3"
            title="Get Recommendations"
            description="Receive personalized career suggestions with match scores"
            link="/roadmap"
          />
          <StepCard
            number="4"
            title="Chat with AI"
            description="Ask questions and get expert guidance anytime"
            link="/chat"
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-600 text-white py-16 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <StatCard number="10,000+" label="Students Guided" />
            <StatCard number="500+" label="Career Paths" />
            <StatCard number="95%" label="Satisfaction Rate" />
            <StatCard number="24/7" label="Support Available" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Discover Your Perfect Career?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Start your journey today. Take the assessment, build your profile, and get personalized guidance - completely free!
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/assessment"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
            >
              <ClipboardList className="h-5 w-5" />
              Start Assessment
            </Link>
            <Link
              href="/profile"
              className="bg-purple-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-800 transition-colors inline-flex items-center gap-2"
            >
              Build Profile
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
          <p className="mt-4 text-sm opacity-80">
            Want to save your progress? <Link href="/signup" className="underline font-semibold">Sign up free</Link>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2026 AI Career Counsellor - Team 48. Built with ❤️ for Indian Students.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, link }: { icon: React.ReactNode; title: string; description: string; link: string }) {
  return (
    <Link href={link}>
      <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 cursor-pointer h-full">
        <div className="text-blue-600 mb-4">{icon}</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  );
}

function StepCard({ number, title, description, link }: { number: string; title: string; description: string; link: string }) {
  return (
    <Link href={link}>
      <div className="text-center group cursor-pointer">
        <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 group-hover:scale-110 transition-transform">
          {number}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </Link>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="text-4xl font-bold mb-2">{number}</div>
      <div className="text-blue-100">{label}</div>
    </div>
  );
}