"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap,
  LogIn,
  UserPlus,
  LogOut,
  User,
  Globe
} from "lucide-react";

export default function Navbar() {

  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [languageOpen, setLanguageOpen] = useState(false);

  useEffect(() => {

    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const currentUser = localStorage.getItem("currentUser");

    setIsLoggedIn(loggedIn);

    if (currentUser) {
      const user = JSON.parse(currentUser);
      setUserName(user.name);
    }

  }, []);

  const handleLogout = () => {

    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");

    setIsLoggedIn(false);
    setUserName("");

    router.push("/login");
  };

  const changeLanguage = (lang) => {

    const select = document.querySelector(".goog-te-combo");

    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event("change"));
    }

    setLanguageOpen(false);
  };

  return (

    <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">

      <div className="container mx-auto px-4 py-4 flex justify-between items-center">

        {/* Logo */}

        <Link href="/" className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-900">
            AI Career Counsellor
          </span>
        </Link>

        {/* Navigation */}

        <div className="flex items-center space-x-6">

          <Link href="/chat" className="text-gray-600 hover:text-gray-900">
            Chat
          </Link>

          <Link href="/profile" className="text-gray-600 hover:text-gray-900">
            Profile
          </Link>

          <Link href="/assessment" className="text-gray-600 hover:text-gray-900">
            Assessment
          </Link>

          <Link href="/roadmap" className="text-gray-600 hover:text-gray-900">
            Roadmap
          </Link>

          {/* Language Switcher */}

          <div className="relative">

            <button
              onClick={() => setLanguageOpen(!languageOpen)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <Globe className="h-5 w-5"/>
              Language
            </button>

            {languageOpen && (

              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg">

                <button onClick={()=>changeLanguage("en")} className="block w-full text-left px-4 py-2 hover:bg-gray-100">English</button>
                <button onClick={()=>changeLanguage("hi")} className="block w-full text-left px-4 py-2 hover:bg-gray-100">हिन्दी</button>
                <button onClick={()=>changeLanguage("ta")} className="block w-full text-left px-4 py-2 hover:bg-gray-100">தமிழ்</button>
                <button onClick={()=>changeLanguage("te")} className="block w-full text-left px-4 py-2 hover:bg-gray-100">తెలుగు</button>
                <button onClick={()=>changeLanguage("kn")} className="block w-full text-left px-4 py-2 hover:bg-gray-100">ಕನ್ನಡ</button>
                <button onClick={()=>changeLanguage("ml")} className="block w-full text-left px-4 py-2 hover:bg-gray-100">മലയാളം</button>
                <button onClick={()=>changeLanguage("fr")} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Français</button>

              </div>

            )}

          </div>

          {isLoggedIn ? (
            <>
              <div className="flex items-center gap-2 text-gray-700">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">{userName}</span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                <LogOut className="h-4 w-4"/>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <LogIn className="h-4 w-4"/>
                Login
              </Link>

              <Link
                href="/signup"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <UserPlus className="h-4 w-4"/>
                Sign Up
              </Link>
            </>
          )}

        </div>

      </div>

    </nav>
  );
}