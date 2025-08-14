// Chú ý: Trang này chỉ sử dụng dữ liệu demo, số liệu demo. Không truy xuất dữ liệu thật!
import React, { useState } from "react";
import { MainContentLayout } from "@/components/main-content-layout";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const TABS = ["Thông tin", "Bài hát", "Album", "Social", "Hợp đồng"];

export default function TrangNgheSi() {
  const [tab, setTab] = useState("Thông tin");
  const [showModal, setShowModal] = useState(false);
  const [avatar, setAvatar] = useState("/face.png");
  const [status, setStatus] = useState("Đã duyệt");

  return (
    <MainContentLayout>
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-6 text-purple-700">
          Trang Nghệ Sĩ
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
        {/* Demo trạng thái duyệt */}
        <div className="mb-4 flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
            {status}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              setStatus(status === "Đã duyệt" ? "Chờ duyệt" : "Đã duyệt")
            }
          >
            Chuyển trạng thái
          </Button>
        </div>
        {/* Avatar và nút chỉnh sửa */}
        <div className="flex items-center gap-6 mb-6">
          <Image
            src={avatar}
            alt="Avatar"
            width={80}
            height={80}
            className="rounded-full border-4 border-purple-500"
          />
          <div>
            <h3 className="text-xl font-bold">An Kun</h3>
            <p className="text-gray-600">GenZ Melody Artist</p>
            <Button
              size="sm"
              className="mt-2 bg-purple-600 text-white"
              onClick={() => setShowModal(true)}
            >
              Chỉnh sửa avatar
            </Button>
          </div>
        </div>
        {/* Modal cập nhật avatar demo */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-80 shadow-xl relative">
              <h4 className="text-lg font-bold mb-4">Cập nhật avatar</h4>
              <input
                type="text"
                placeholder="Nhập link ảnh demo..."
                className="w-full px-3 py-2 border rounded mb-4"
                onChange={(e) => setAvatar(e.target.value)}
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
        {/* Nội dung tab demo */}
        {tab === "Thông tin" && (
          <div>
            <div className="mb-4">
              <p className="font-semibold">Tiểu sử:</p>
              <p className="text-gray-700">
                Nghệ sĩ trẻ, đam mê sáng tác và lan tỏa âm nhạc đến cộng đồng
                Gen Z.
              </p>
            </div>
            <div className="mb-4">
              <p className="font-semibold">Liên kết mạng xã hội:</p>
              <ul className="list-disc ml-6 text-purple-600">
                <li>Facebook: facebook.com/ankun</li>
                <li>Instagram: instagram.com/ankun</li>
                <li>Youtube: youtube.com/@ankun</li>
              </ul>
            </div>
          </div>
        )}
        {tab === "Bài hát" && (
          <div>
            <p className="font-semibold mb-2">Danh sách bài hát demo:</p>
            <ul className="list-disc ml-6 text-purple-600">
              <li>GenZ Melody</li>
              <li>Send Gift Your Song</li>
              <li>Dreamer</li>
            </ul>
            <Button className="mt-4 bg-purple-600 text-white">
              Thêm bài hát demo
            </Button>
          </div>
        )}
        {tab === "Album" && (
          <div>
            <p className="font-semibold mb-2">Album demo:</p>
            <ul className="list-disc ml-6 text-purple-600">
              <li>GenZ Collection</li>
              <li>Young Dream</li>
            </ul>
            <Button className="mt-4 bg-purple-600 text-white">
              Thêm album demo
            </Button>
          </div>
        )}
        {tab === "Social" && (
          <div>
            <p className="font-semibold mb-2">Social demo:</p>
            <ul className="list-disc ml-6 text-purple-600">
              <li>Facebook: facebook.com/ankun</li>
              <li>Instagram: instagram.com/ankun</li>
              <li>Youtube: youtube.com/@ankun</li>
              <li>Tiktok: tiktok.com/@ankun</li>
            </ul>
            <Button className="mt-4 bg-purple-600 text-white">
              Chỉnh sửa liên kết demo
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
      </div>
    </MainContentLayout>
  );
}
