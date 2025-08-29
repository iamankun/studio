"use client";

import { useState, useEffect, ReactNode } from "react";
import { AuthContext } from "@/hooks/use-user";
import type { User } from "@/types/user";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for existing user
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      }
    } catch (error) {
      console.error("Error loading user from localStorage:", error);
      localStorage.removeItem('currentUser');
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const result = await response.json();
      
      if (result.success && result.user) {
        setUser(result.user);
        localStorage.setItem('currentUser', JSON.stringify(result.user));
        return { success: true };
      } else {
        return { success: false, message: result.message || "Đăng nhập thất bại" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Lỗi kết nối" };
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        return { success: true, message: "Đăng ký thành công" };
      } else {
        return { success: false, message: result.message || "Đăng ký thất bại" };
      }
    } catch (error) {
      console.error("Register error:", error);
      return { success: false, message: "Lỗi kết nối" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}