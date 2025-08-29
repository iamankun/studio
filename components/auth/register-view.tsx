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
  }
