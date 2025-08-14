// Chú ý: Trang này chỉ sử dụng dữ liệu demo, số liệu demo. Không truy xuất dữ liệu thật!
import React, { useState } from "react";
import { MainContentLayout } from "@/components/main-content-layout";
import { Button } from "@/components/ui/button";
import { AKSDataTable } from "@/components/aksdata/aks-data-table";
import { columns } from "@/components/aksdata/columns";

const TABS = ["Bảng dữ liệu", "Upload", "Thống kê"];

// Dữ liệu file demo
const filesDemo = [
  {
    id: 1,
    name: "ankun_song.mp3",
    type: "audio",
    size: "5MB",
    status: "Đã duyệt",
  },
  { id: 2, name: "cover.jpg", type: "image", size: "1MB", status: "Chờ duyệt" },
  { id: 3, name: "lyric.txt", type: "text", size: "20KB", status: "Đã duyệt" },
];

export default function TrangFileDataDemo() {
  const [tab, setTab] = useState("Bảng dữ liệu");
  const [showModal, setShowModal] = useState(false);

  return (
    <MainContentLayout>
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-4xl mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-6 text-purple-700">
          Quản Lý File Data Demo
        </h2>
        {/* Tab chuyển đổi */}
        <div className="flex gap-2 mb-6">
          {TABS.map((t) => (
            <Button
              key={t}
              variant={tab === t ? "default" : "outline"}
              className={tab === t ? "bg-purple-600 text-white" : ""}
              onClick={() => setTab(t)}
            >
              {t}
            </Button>
          ))}
        </div>
        {/* Nội dung tab demo */}
        {tab === "Bảng dữ liệu" && (
          <div>
            <AKSDataTable columns={columns} data={filesDemo} />
            <Button
              className="mt-4 bg-purple-600 text-white"
              onClick={() => setShowModal(true)}
            >
              Upload file demo
            </Button>
          </div>
        )}
        {tab === "Upload" && (
          <div>
            <p className="font-semibold mb-2">Upload file demo:</p>
            <Button
              className="bg-purple-600 text-white"
              onClick={() => setShowModal(true)}
            >
              Chọn file demo
            </Button>
          </div>
        )}
        {tab === "Thống kê" && (
          <div>
            <p className="font-semibold mb-2">Thống kê file demo:</p>
            <ul className="list-disc ml-6 text-purple-600">
              <li>Tổng số file: {filesDemo.length}</li>
              <li>
                File âm nhạc:{" "}
                {filesDemo.filter((f) => f.type === "audio").length}
              </li>
              <li>
                File hình ảnh:{" "}
                {filesDemo.filter((f) => f.type === "image").length}
              </li>
              <li>
                File văn bản:{" "}
                {filesDemo.filter((f) => f.type === "text").length}
              </li>
            </ul>
          </div>
        )}
        {/* Modal upload demo */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-80 shadow-xl relative">
              <h4 className="text-lg font-bold mb-4">Upload file demo</h4>
              <input
                type="text"
                placeholder="Nhập tên file demo..."
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
