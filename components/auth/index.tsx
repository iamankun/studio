"use client";

import { useState, useEffect, ReactNode } from "react";
import { LoginView } from "./login-view";
import { RegisterView } from "./register-view";
import { ForgotPasswordView } from "./forgot-password-view";
import { useAuth } from "@/components/auth-provider";
import { DynamicBackground } from "@/components/dynamic-background";

interface AuthProps {
  children: ReactNode;
}

export function Auth({ children }: AuthProps) {
  const { user, login, register } = useAuth();
  const [authView, setAuthView] = useState<"login" | "register" | "forgot">("login");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = () => {
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogin = async (username: string, password: string) => {
    try {
      const result = await login(username, password);
      return result;
    } catch (error) {
      return { success: false, message: "Đăng nhập thất bại" };
    }
  };

  const handleRegister = async (userData: any) => {
    try {
      const result = await register(userData);
      return result;
    } catch (error) {
      return { success: false, message: "Đăng ký thất bại" };
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is logged in, show the main app
  if (user) {
    return <>{children}</>;
  }

  // If not logged in, show auth views
  return (
    <div className="min-h-screen relative">
      <DynamicBackground />
      {authView === "login" && (
        <LoginView
          onLogin={handleLogin}
          onSwitchToRegister={() => setAuthView("register")}
          onSwitchToForgot={() => setAuthView("forgot")}
        />
      )}
      {authView === "register" && (
        <RegisterView
          onRegister={handleRegister}
          onSwitchToLogin={() => setAuthView("login")}
        />
      )}
      {authView === "forgot" && (
        <ForgotPasswordView
          onSwitchToLogin={() => setAuthView("login")}
        />
      )}
    </div>
  );
}