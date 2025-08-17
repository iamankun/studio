'use client';
// Chú ý: Trang này chỉ sử dụng dữ liệu demo, số liệu demo. Không truy xuất dữ liệu thật!
import React, { useState } from "react";
import { MainContentLayout } from "@/components/main-content-layout";
import { Button } from "@/components/ui/button";

const TABS = ["Đăng nhập", "Đăng ký"];

export default function TrangDangNhapMau() {
  const [tab, setTab] = useState("Đăng nhập");
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTimeout(() => {
      setLoading(false);
      if (form.email === "demo@ankun.dev" && form.password === "123456") {
        setSuccess(true);
      } else {
        setError("Sai thông tin đăng nhập!");
      }
    }, 1200);
  };

  // Extracted ternary logic into variables
  let mainContent;
  if (success) {
    mainContent = (
      <div className="text-green-600 text-center">
        <p className="mb-4">Đăng nhập thành công!</p>
        <Button
          onClick={() => setSuccess(false)}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          Đăng nhập lại
        </Button>
      </div>
    );
  } else if (showForgot) {
    mainContent = (
      <div className="text-center">
        <h3 className="text-lg font-bold mb-4 text-purple-700">
          Quên mật khẩu
        </h3>
        <input
          type="email"
          name="email"
          placeholder="Nhập email demo..."
          className="w-full px-4 py-2 border rounded-lg mb-4 text-black"
        />
        <Button className="w-full bg-purple-600 text-white mb-2">
          Gửi yêu cầu demo
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setShowForgot(false)}
        >
          Quay lại đăng nhập
        </Button>
      </div>
    );
  } else {
    let buttonText = "Đăng ký";
    if (loading) {
      buttonText = "Đang xử lý...";
    } else if (tab === "Đăng nhập") {
      buttonText = "Đăng nhập";
    }
    mainContent = (
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg text-black"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={form.password}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg text-black"
          required
        />
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <Button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          disabled={loading}
        >
          {buttonText}
        </Button>
        {tab === "Đăng nhập" && (
          <Button
            variant="link"
            className="w-full text-purple-600"
            type="button"
            onClick={() => setShowForgot(true)}
          >
            Quên mật khẩu demo?
          </Button>
        )}
      </form>
    );
  }

  return (
    <MainContentLayout>
       <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md mx-auto mt-8 text-black">
        <div className="flex gap-2 mb-6 justify-center">
          {TABS.map((t) => (
            <Button
              key={t}
              variant={tab === t ? "default" : "outline"}
              className={tab === t ? "bg-purple-600 text-white" : ""}
              onClick={() => {
                setTab(t);
                setSuccess(false);
                setError("");
                setShowForgot(false);
              }}
            >
              {t}
            </Button>
          ))}
        </div>
        <h2 className="text-2xl font-bold mb-6 text-purple-700 text-center">
          {tab === "Đăng nhập" ? "Đăng nhập hệ thống (Mẫu)" : "Đăng ký tài khoản (Mẫu)"}
        </h2>
        {mainContent}
      </div>
    </MainContentLayout>
  );
}