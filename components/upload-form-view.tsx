import type { Submission } from "@/types/submission";
import type { User } from "@/types/user";

export interface UploadFormViewProps {
  readonly currentUser: User;
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
        className="bg-purple-600 text-white px-4 py-2 rounded"
        onClick={() =>
          handleSubmit(currentUser.name || "Nghệ sĩ", "Bài hát demo")
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
