'use client';
// Chú ý: Trang này chỉ sử dụng dữ liệu demo, số liệu demo. Không truy xuất dữ liệu thật!
import React, { useState } from "react";
import { MainContentLayout } from "@/components/main-content-layout";
import { Button } from "@/components/ui/button";

const TABS = ["Thống kê", "Nghệ sĩ", "Bài hát", "Phát hành", "Tài khoản"];

export default function TrangQuanTriHeThong() {
  // Trang demo, không kiểm tra đăng nhập, ai cũng xem được
  const [tab, setTab] = useState("Thống kê");
  const [showModal, setShowModal] = useState(false);
  return (
    <MainContentLayout>
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg mx-auto mt-8 text-black">
        <h2 className="text-2xl font-bold mb-6 text-purple-700">
          Trang Quản Trị Hệ Thống (Mẫu)
        </h2>
        {/* Tab chuyển đổi */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {TABS.map((t) => (
            <Button
              key={t}
              variant={tab === t ? "default" : "outline"}
              className={`whitespace-nowrap ${tab === t ? "bg-purple-600 text-white" : ""}`}
              onClick={() => setTab(t)}
            >
              {t}
            </Button>
          ))}
        </div>
        {/* Nội dung tab demo */}
        {tab === "Thống kê" && (
          <div>
            <p className="font-semibold mb-2">Thống kê nhanh:</p>
            <ul className="list-disc ml-6 text-purple-600">
              <li>Tổng số nghệ sĩ: 120</li>
              <li>Tổng số bài hát: 350</li>
              <li>Bản phát hành đang chờ duyệt: 15</li>
            </ul>
          </div>
        )}
        {tab === "Nghệ sĩ" && (
          <div>
            <p className="font-semibold mb-2">Quản lý nghệ sĩ demo:</p>
            <ul className="list-disc ml-6 text-purple-600">
              <li>An Kun</li>
              <li>Mai Linh</li>
              <li>GenZ Band</li>
            </ul>
            <Button
              className="mt-4 bg-purple-600 text-white"
              onClick={() => setShowModal(true)}
            >
              Thêm nghệ sĩ demo
            </Button>
          </div>
        )}
        {tab === "Bài hát" && (
          <div>
            <p className="font-semibold mb-2">Quản lý bài hát demo:</p>
            <ul className="list-disc ml-6 text-purple-600">
              <li>GenZ Melody</li>
              <li>Young Dream</li>
            </ul>
            <Button className="mt-4 bg-purple-600 text-white">
              Thêm bài hát demo
            </Button>
          </div>
        )}
        {tab === "Phát hành" && (
          <div>
            <p className="font-semibold mb-2">Quản lý phát hành demo:</p>
            <ul className="list-disc ml-6 text-purple-600">
              <li>GenZ Melody - Đang chờ duyệt</li>
              <li>Young Dream - Đã phát hành</li>
            </ul>
            <Button className="mt-4 bg-purple-600 text-white">
              Thêm phát hành
            </Button>
          </div>
        )}
        {tab === "Tài khoản" && (
          <div>
            <p className="font-semibold mb-2">Quản lý tài khoản demo:</p>
            <ul className="list-disc ml-6 text-purple-600">
              <li>ankun@studio.dev</li>
              <li>mailinh@studio.dev</li>
            </ul>
            <Button className="mt-4 bg-purple-600 text-white">
              Thêm tài khoản
            </Button>
          </div>
        )}
        {/* Modal demo thêm nghệ sĩ */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-80 shadow-xl relative text-black">
              <h4 className="text-lg font-bold mb-4">Thêm nghệ sĩ</h4>
              <input
                type="text"
                placeholder="Nhập tên nghệ sĩ demo..."
                className="w-full px-3 py-2 border rounded mb-4"
              />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Đóng
                </Button>
                <Button
                  className="bg-purple-600 text-white"
                  onClick={() => setShowModal(false)}
                >
                  Lưu
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainContentLayout>
  );
}