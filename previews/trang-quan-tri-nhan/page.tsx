'use client';
// Chú ý: Trang này chỉ sử dụng dữ liệu demo, số liệu demo. Không truy xuất dữ liệu thật!
import React, { useState } from "react";
import { MainContentLayout } from "@/components/main-content-layout";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const TABS = ["Thông tin nhãn", "Nghệ sĩ", "Hợp đồng", "Phát hành"];

export default function TrangQuanTriNhan() {
  const [tab, setTab] = useState("Thông tin nhãn");
  const [showModal, setShowModal] = useState(false);
  const labelDemo = {
    name: "GenZ Music Label",
    manager: "An Kun",
    artistCount: 25,
    contracts: 12,
    releases: 8,
    avatar: "/face.png",
  };
  const artistsDemo = [
    { name: "An Kun", role: "Quản lý" },
    { name: "Mai Linh", role: "Nghệ sĩ" },
    { name: "Hải Đăng", role: "Nghệ sĩ" },
    { name: "GenZ Band", role: "Nhóm" },
  ];
  return (
    <MainContentLayout>
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg mx-auto mt-8 text-black">
        <h2 className="text-2xl font-bold mb-6 text-purple-700">
          Trang Quản Trị Nhãn (Mẫu)
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
        {tab === "Thông tin nhãn" && (
          <div>
            <div className="flex items-center gap-6 mb-6">
              <Image
                src={labelDemo.avatar}
                alt="Label Avatar"
                width={80}
                height={80}
                className="rounded-full border-4 border-purple-500"
              />
              <div>
                <h3 className="text-xl font-bold">{labelDemo.name}</h3>
                <p className="text-gray-600">Quản lý: {labelDemo.manager}</p>
              </div>
            </div>
            <ul className="list-disc ml-6 text-purple-600 mb-4">
              <li>Số nghệ sĩ trực thuộc: {labelDemo.artistCount}</li>
              <li>Số hợp đồng: {labelDemo.contracts}</li>
              <li>Số bản phát hành: {labelDemo.releases}</li>
            </ul>
            <Button
              className="bg-purple-600 text-white"
              onClick={() => setShowModal(true)}
            >
              Chỉnh sửa thông tin nhãn demo
            </Button>
          </div>
        )}
        {tab === "Nghệ sĩ" && (
          <div>
            <p className="font-semibold mb-2">
              Danh sách nghệ sĩ trực thuộc (demo):
            </p>
            <ul className="list-disc ml-6 text-purple-600">
              {artistsDemo.map((artist) => (
                <li key={artist.name} className="text-gray-700">
                  {artist.name} ({artist.role})
                </li>
              ))}
            </ul>
            <Button
              className="mt-4 bg-purple-600 text-white"
              onClick={() => setShowModal(true)}
            >
              Thêm nghệ sĩ demo
            </Button>
          </div>
        )}
        {tab === "Hợp đồng" && (
          <div>
            <p className="font-semibold mb-2">Hợp đồng demo:</p>
            <ul className="list-disc ml-6 text-purple-600">
              <li>Hợp đồng phát hành GenZ Melody</li>
              <li>Hợp đồng quảng bá Young Dream</li>
            </ul>
            <Button className="mt-4 bg-purple-600 text-white">
              Thêm hợp đồng demo
            </Button>
          </div>
        )}
        {tab === "Phát hành" && (
          <div>
            <p className="font-semibold mb-2">Phát hành demo:</p>
            <ul className="list-disc ml-6 text-purple-600">
              <li>GenZ Melody - Đang chờ duyệt</li>
              <li>Young Dream - Đã phát hành</li>
            </ul>
            <Button className="mt-4 bg-purple-600 text-white">
              Thêm phát hành demo
            </Button>
          </div>
        )}
        {/* Modal demo chỉnh sửa/thêm */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-80 shadow-xl relative text-black">
              <h4 className="text-lg font-bold mb-4">Chỉnh sửa/Thêm demo</h4>
              <input
                type="text"
                placeholder="Nhập thông tin demo..."
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
        <div className="text-xs text-gray-400 mt-4">
          Trang này chỉ dùng dữ liệu demo, không liên quan dữ liệu thật.
        </div>
      </div>
    </MainContentLayout>
  );
}