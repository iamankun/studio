"use client";

import type React from "react";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loader2, User, Mail, Lock, Shield } from "lucide-react";
import Image from "next/image";
import { logUIInteraction, logRegistration } from "@/lib/client-activity-log";

import "@/components/awesome/css/all.min.css";

interface RegisterViewProps {
  onRegister: (
    username: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  onSwitchToLogin: () => void;
}

export function RegisterView({
  onRegister,
  onSwitchToLogin,
}: Readonly<RegisterViewProps>) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateForm = useCallback(() => {
    const errors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
    let isValid = true;

    if (username.length < 3) {
      errors.username = "Tài khoản phải có ít nhất 3 ký tự";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.email = "Email không hợp lệ";
      isValid = false;
    }

    if (password.length < 6) {
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
      isValid = false;
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Mật khẩu không khớp";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  }, [username, email, password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    if (!agreed) {
      setError("Bạn phải đồng ý với điều khoản sử dụng");
      return;
    }

    setLoading(true);

    // Ghi lại nỗ lực đăng ký
    logUIInteraction("form", "register-form", {
      username: username,
      email_domain: email.split("@")[1],
    });

    try {
      const result = await onRegister(username, email, password);
      console.log("[Sữa lỗi] API đăng ký kết quả:", result);
      if (result.success) {
        // Ghi lại đăng ký thành công
        logRegistration("email", "success", {
          username: username,
          email_domain: email.split("@")[1],
        });

        setSuccessMessage(
          "Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ."
        );
        // Làm mới bản ghi
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setAgreed(false);
      } else {
        // Ghi lại đăng ký thất bại
        logRegistration("email", "failed", {
          username: username,
          email_domain: email.split("@")[1],
          error: result.message,
        });

        setError(result.message || "Đăng ký thất bại, vui lòng thử lại");
      }
    } catch (error) {
      console.error("[Sữa lỗi] Đăng ký lỗi:", error);

      // Ghi lại lỗi trong quá trình đăng ký
      logRegistration("email", "error", {
        username: username,
        email_domain: email.split("@")[1],
        error: error instanceof Error ? error.message : String(error),
      });

      setError("Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center p-4 pt-24 relative overflow-hidden font-dosis">
      <Card className="w-full max-w-md relative z-40 border border-white/10 shadow-2xl bg-background/5 backdrop-blur-2xl hover:bg-background/10 transition-all duration-500">
        <CardHeader className="text-center relative z-10">
          <div className="relative w-20 h-20 mx-auto mb-2">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-full blur-lg"></div>
            <Image
              src="/face.png"
              fill
              alt="User avatar"
              className="object-cover rounded-full p-1 bg-background/10 backdrop-blur-xl border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105"
              priority
            />
          </div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-pink-500 select-none">
            Đăng ký tài khoản
          </h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                Tên tài khoản
              </Label>
              <div className="relative">
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 bg-background/30 border-white/10 focus:border-primary/50"
                  placeholder="Nhập tên tài khoản"
                  disabled={loading}
                />
                <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground/50" />
              </div>
              {validationErrors.username && (
                <div className="text-xs text-destructive mt-1 ml-1">
                  <i className="fas fa-exclamation-circle"></i>
                  {validationErrors.username}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-background/30 border-white/10 focus:border-primary/50"
                  placeholder="your@email.com"
                  disabled={loading}
                />
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground/50" />
              </div>
              {validationErrors.email && (
                <div className="text-xs text-destructive mt-1 ml-1">
                  <i className="fas fa-exclamation-circle"></i>
                  {validationErrors.email}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Mật khẩu
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-background/30 border-white/10 focus:border-primary/50"
                  placeholder="Nhập mật khẩu"
                  disabled={loading}
                />
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground/50" />
              </div>
              {validationErrors.password && (
                <div className="text-xs text-destructive mt-1 ml-1">
                  <i className="fas fa-exclamation-circle"></i>
                  {validationErrors.password}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Xác nhận mật khẩu
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 bg-background/30 border-white/10 focus:border-primary/50"
                  placeholder="Nhập lại mật khẩu"
                  disabled={loading}
                />
                <Shield className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground/50" />
              </div>
              {validationErrors.confirmPassword && (
                <div className="text-xs text-destructive mt-1 ml-1">
                  <i className="fas fa-exclamation-circle"></i>
                  {validationErrors.confirmPassword}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="agree"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="agree" className="text-sm">
                Tôi đồng ý với điều khoản sử dụng
              </Label>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                <i className="fas fa-exclamation-triangle"></i>
                <span className="ml-2">{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                <i className="fas fa-check-circle"></i>
                <span className="ml-2">{successMessage}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary via-purple-600 to-primary hover:scale-[1.02] hover:shadow-xl"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Đăng ký"
              )}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="ghost"
                onClick={onSwitchToLogin}
                className="text-muted-foreground hover:text-primary"
              >
                Đã có tài khoản? Đăng nhập
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
