import React, { useState, useEffect } from "react";
import type { User } from "@/types/user";

export interface UploadFormViewProps {
  readonly currentUser: User;
}

function SuccessAnimation({
  artistName,
  songTitle,
  onClose,
}: Readonly<{
  artistName: string;
  songTitle: string;
  onClose: () => void;
}>) {
  // Keyboard handler for accessibility
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-50">
      <div className="p-6 rounded-lg text-center bg-white shadow-lg">
        <h2 className="mb-2 text-2xl font-bold text-green-600">Thành công!</h2>
        <p>
          Đã gửi bài hát <strong>{songTitle}</strong> của nghệ sĩ{" "}
          <strong>{artistName}</strong>.
        </p>
        <button
          className="mt-4 px-4 py-2 rounded bg-purple-600 text-white"
          onClick={onClose}
          onKeyDown={handleKeyDown}
          autoFocus
        >
          Đóng
        </button>
      </div>
    </div>
  );
}

export function UploadFormView({ currentUser }: Readonly<UploadFormViewProps>) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [previewData, setPreviewData] = useState<{
    artistName: string;
    songTitle: string;
  } | null>(null);

  // Giả lập submit form
  const handleSubmit = (artistName: string, songTitle: string) => {
    // ...logic upload và xác nhận thành công...
    setPreviewData({ artistName, songTitle });
    setShowSuccess(true);
    // Có thể gọi onSubmissionAddedAction nếu cần
  };

  // Khi animation đóng
  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setPreviewData(null);
  };

  // Áp dụng cursor pointer toàn trang khi animation hiển thị
  useEffect(() => {
    if (showSuccess) {
      document.body.style.cursor = "pointer";
    } else {
      document.body.style.cursor = "";
    }
    return () => {
      document.body.style.cursor = "";
    };
  }, [showSuccess]);

  return (
    <div>
      {/* Nội dung form upload sẽ ở đây */}
      {/* Ví dụ nút submit giả lập */}
      <button
        className="px-4 py-2 rounded bg-purple-600 text-white"
        onClick={() =>
          handleSubmit(currentUser.name || "Nghệ sĩ", "Bài hát ")
        }
      >
        Gửi bài hát
      </button>

      {/* Hiển thị animation khi thành công */}
      {showSuccess && previewData && (
        <SuccessAnimation
          artistName={previewData.artistName}
          songTitle={previewData.songTitle}
          onClose={handleCloseSuccess}
        />
      )}
    </div>
  );
}
