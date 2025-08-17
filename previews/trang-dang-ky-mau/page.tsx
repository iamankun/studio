'use client';
// Chú ý: Trang này chỉ sử dụng dữ liệu demo, số liệu demo. Không truy xuất dữ liệu thật!
import React, { useState } from "react";
import { MainContentLayout } from "@/components/main-content-layout";
import { Button } from "@/components/ui/button";

export default function TrangDangKyMau() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
  };

  return (
    <MainContentLayout>
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md mx-auto mt-8 text-black">
        <h2 className="text-2xl font-bold mb-6 text-purple-700 text-center">
          Đăng ký tài khoản (Mẫu)
        </h2>
        {success ? (
          <div className="text-green-600 text-center">
            <p className="mb-4">Đăng ký thành công!</p>
            <Button
              onClick={() => setSuccess(false)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Đăng ký lại
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Tên nghệ sĩ"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg text-black"
              required
            />
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
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              Đăng ký
            </Button>
          </form>
        )}
      </div>
    </MainContentLayout>
  );
}