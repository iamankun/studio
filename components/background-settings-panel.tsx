"use client";

import type React from "react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  type BackgroundSettings,
  BACKGROUND_SETTINGS_KEY,
  DEFAULT_BACKGROUND_SETTINGS,
} from "@/lib/constants";
import { logBackgroundSettings } from "@/lib/client-activity-log";

const DEFAULT_VIDEOS = [
  "dQw4w9WgXcQ",
  "kJQP7kiw5Fk",
  "fJ9rUzIMcZQ",
  "9bZkp7q19f0",
  "hTWKbfoikeg",
  "YQHsXMglC9A",
  "CevxZvSJLk8",
  "JGwWNGJdvx8",
  "RgKAFK5djSk",
  "OPf0YbXqDm0"
];

// No props needed for this component

export function BackgroundSettingsPanel() {
  // State cho danh sách input videoId thêm thủ công
  const [manualVideoIds, setManualVideoIds] = useState<string[]>([]);
  const [backgroundSettings, setBackgroundSettings] =
    useState<BackgroundSettings>(DEFAULT_BACKGROUND_SETTINGS);
  const [showCustomPanel, setShowCustomPanel] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [overlayOpacity, setOverlayOpacity] = useState("0.5");
  const [previewImageUrl, setPreviewImageUrl] = useState(
    backgroundSettings.imageUrl || ""
  );
  const [playlistVideos, setPlaylistVideos] = useState<string[]>([]);

  useEffect(() => {
    async function fetchLatestBackground() {
      // Luôn lấy từ nhật ký hệ thống
      try {
        const res = await fetch(
          "/api/activity-log?action=background_update&limit=1"
        );
        const data = await res.json();
        if (data.success && data.logs.length > 0) {
          const log = data.logs[0];
          const settings = log.details;
          setBackgroundSettings({
            ...DEFAULT_BACKGROUND_SETTINGS,
            ...settings,
          });
          setYoutubeUrl(settings.videoUrl ?? "");
          setOverlayOpacity(settings.opacity?.toString() ?? "0.5");
          setPreviewImageUrl(settings.imageUrl || "");
        }
      } catch { }
    }
    fetchLatestBackground();
  }, []);

  // Hàm lưu settings, bao gồm cả playlistVideos nếu có
  const saveSettings = async () => {
    try {
      let newSettings = {
        ...backgroundSettings,
        opacity: parseFloat(overlayOpacity),
        videoUrl: youtubeUrl || backgroundSettings.videoUrl,
      };
      if (playlistVideos.length > 0) {
        newSettings = {
          ...newSettings,
          videoList: playlistVideos,
          randomVideo: true,
        };
      }
      setBackgroundSettings(newSettings);
      window.dispatchEvent(
        new CustomEvent("backgroundUpdate", { detail: newSettings })
      );
      // Luôn ghi vào nhật ký hệ thống
      await logBackgroundSettings(newSettings);
    } catch (error) {
      console.error("Failed to save background settings:", error);
    }
  };

  // Hàm trích xuất videoId hoặc playlistId từ URL YouTube
  const handleVideoUrlChange = async (url: string) => {
    // Regex cho videoId
    const videoRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
    // Regex cho playlistId
    const playlistRegex = /[?&]list=([a-zA-Z0-9_-]+)/;
    const videoMatch = videoRegex.exec(url);
    const playlistMatch = playlistRegex.exec(url);
    const videoId = videoMatch ? videoMatch[1] : "";
    const playlistId = playlistMatch ? playlistMatch[1] : "";

    if (playlistId) {
      // Nếu là playlist, gọi API YouTube để lấy danh sách video
      try {
        // Sử dụng fetch để lấy danh sách video từ playlist
        // Lưu ý: Cần có API key hợp lệ, demo dùng fetch public API (giới hạn 50 video)
        const apiKey = "YOUTUBE_API_KEY"; // Thay bằng API key thật nếu có
        const apiUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}`;
        const res = await fetch(apiUrl);
        const data = await res.json();
        if (data.items) {
          const ids = data.items
            .map((item: { snippet: { resourceId: { videoId: string } } }) => item.snippet.resourceId.videoId)
            .filter(Boolean);
          setPlaylistVideos(ids);
          setBackgroundSettings((prev) => ({
            ...prev,
            type: "video" as const,
            videoList: ids,
            randomVideo: true,
            videoUrl: "",
          }));
        }
      } catch (err) {
        console.error("Danh sách video từ playlist không thể lấy:", err);
      }
      setYoutubeUrl(playlistId);
    } else if (videoId) {
      setYoutubeUrl(videoId);
      setBackgroundSettings((prev) => ({
        ...prev,
        type: "video" as const,
        videoUrl: videoId,
        randomVideo: false,
      }));
      setPlaylistVideos([]);
    } else if (url.length === 11) {
      // Nếu nhập trực tiếp videoId
      setYoutubeUrl(url);
      setBackgroundSettings((prev) => ({
        ...prev,
        type: "video" as const,
        videoUrl: url,
        randomVideo: false,
      }));
      setPlaylistVideos([]);
    } else {
      alert("Vui lòng nhập đúng videoId hoặc link playlist/video YouTube.");
    }
  };

  // Update background settings when opacity changes
  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newOpacity = e.target.value;
    setOverlayOpacity(newOpacity);
    setBackgroundSettings((prev) => ({
      ...prev,
      opacity: parseFloat(newOpacity),
    }));
  };

  // Update video random mode và videoList
  const updateVideoSettings = (randomVideo: boolean) => {
    let videoList: string[] = [];
    if (randomVideo) {
      videoList = playlistVideos.length > 0 ? playlistVideos : DEFAULT_VIDEOS;
    }
    setBackgroundSettings((prev) => ({
      ...prev,
      randomVideo,
      videoList,
    }));
  };

  // Update sound settings
  const updateSoundSettings = (enableSound: boolean) => {
    setBackgroundSettings((prev) => ({
      ...prev,
      enableSound,
    }));
  };

  // Hàm xóa video khỏi danh sách
  const removeVideo = (idToRemove: string) => {
    setBackgroundSettings((prev) => ({
      ...prev,
      videoList: prev.videoList.filter((id) => id !== idToRemove),
    }));
    setManualVideoIds((prev) => prev.filter((id) => id !== idToRemove));
  };

  // Hàm thêm input nhập videoId
  const addManualVideoInput = () => {
    setManualVideoIds((prev) => [...prev, ""]);
  };

  // Hàm cập nhật giá trị videoId nhập thủ công
  const handleManualVideoIdChange = (index: number, value: string) => {
    const updated = [...manualVideoIds];
    updated[index] = value;
    setManualVideoIds(updated);
    // Cập nhật vào videoList
    setBackgroundSettings((prev) => ({
      ...prev,
      videoList: [
        ...prev.videoList.filter((id) => !manualVideoIds.includes(id)),
        ...updated.filter((id) => id.length === 11),
      ],
      randomVideo: updated.length > 1,
    }));
  };

  return (
    <div className="fixed z-50 top-16 right-4">
      <div className="w-80 max-h-[80vh] p-6 overflow-y-auto bg-gray-900/95 border border-gray-700 rounded-lg backdrop-blur-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Tùy chỉnh nền</h3>
          <button
            className="text-gray-400 hover:text-white transition-colors"
            onClick={() => setShowCustomPanel(!showCustomPanel)}
          >
            {showCustomPanel ? "Đơn giản" : "Nâng cao"}
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="opacity"
              className="block text-sm font-medium text-gray-200"
            >
              <span className="flex items-center">
                Độ mờ nền
                <span className="text-xs text-gray-400 ml-2">
                  ({Math.round(Number(overlayOpacity) * 100)}%)
                </span>
              </span>
            </label>
            <input
              id="opacity"
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={overlayOpacity}
              onChange={handleOpacityChange}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="backgroundType"
              className="block text-sm font-medium text-gray-200"
            >
              Loại nền
            </label>
            <select
              id="backgroundType"
              value={backgroundSettings.type}
              onChange={(e) => {
                const newType = e.target.value as
                  | "gradient"
                  | "video"
                  | "image";
                setBackgroundSettings((prev) => ({ ...prev, type: newType }));
              }}
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-gray-200 text-sm"
            >
              <option value="gradient">Nền gradient</option>
              <option value="video">Video nền</option>
              <option value="image">Ảnh nền</option>
            </select>
          </div>

          {backgroundSettings.type === "gradient" && (
            <div className="space-y-4 p-6 bg-black/30 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl">
              <div className="space-y-2">
                <label
                  htmlFor="gradient"
                  className="block text-sm font-medium text-gray-200"
                >
                  Chọn gradient
                </label>
                <select
                  id="gradient"
                  value={backgroundSettings.gradient}
                  onChange={(e) => {
                    setBackgroundSettings((prev) => ({
                      ...prev,
                      gradient: e.target.value,
                    }));
                  }}
                  className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-gray-200 text-sm"
                >
                  <option value="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
                    Tím - Xanh
                  </option>
                  <option value="linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)">
                    Hồng - Cam
                  </option>
                  <option value="linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)">
                    Xanh - Hồng nhạt
                  </option>
                  <option value="linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)">
                    Xanh lá - Xanh dương
                  </option>
                  <option value="linear-gradient(135deg, #f6d365 0%, #fda085 100%)">
                    Vàng - Cam
                  </option>
                  <option value="linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)">
                    Xanh lá nhạt
                  </option>
                  <option value="linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)">
                    Xanh ngọc - Tím
                  </option>
                  <option value="linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)">
                    Tím - Hồng
                  </option>
                  <option value="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
                    Xanh dương - Xanh ngọc
                  </option>
                </select>
              </div>

              {/* Hiển thị xem trước gradient */}
              <div className="mt-4">
                <div
                  className={`w-full h-32 rounded-lg border border-gray-700 gradient-preview`}
                  data-gradient={backgroundSettings.gradient}
                />
              </div>
            </div>
          )}

          {backgroundSettings.type === "video" && (
            <div className="space-y-4 p-6 bg-black/30 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    id="randomVideo"
                    type="checkbox"
                    checked={backgroundSettings.randomVideo}
                    onChange={(e) => updateVideoSettings(e.target.checked)}
                    className="rounded border-gray-600"
                  />
                  <label
                    htmlFor="randomVideo"
                    className="text-sm text-gray-300"
                  >
                    Video ngẫu nhiên
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    id="enableSound"
                    type="checkbox"
                    checked={backgroundSettings.enableSound}
                    onChange={(e) => updateSoundSettings(e.target.checked)}
                    className="rounded border-gray-600"
                  />
                  <label
                    htmlFor="enableSound"
                    className="text-sm text-gray-300"
                  >
                    Bật âm thanh
                  </label>
                </div>
              </div>

              {showCustomPanel && (
                <>
                  <div className="space-y-2">
                    <label
                      htmlFor="youtubeUrl"
                      className="block text-sm font-medium text-gray-200"
                    >
                      YouTube Video ID, URL hoặc Playlist
                    </label>
                    <input
                      id="youtubeUrl"
                      type="text"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      placeholder="Ví dụ: dQw4w9WgXcQ hoặc https://www.youtube.com/watch?v=... hoặc https://www.youtube.com/playlist?list=..."
                      className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-gray-200 text-sm"
                    />
                    <Button
                      onClick={() => handleVideoUrlChange(youtubeUrl)}
                      className="w-full mt-2"
                      size="sm"
                    >
                      Áp dụng video/playlist
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="videoList"
                      className="block text-sm font-medium text-gray-200"
                    >
                      Danh sách video ngẫu nhiên
                    </label>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {(playlistVideos.length > 0
                        ? playlistVideos
                        : backgroundSettings.videoList
                      ).map((id, index) => (
                        <div
                          key={id}
                          className="flex items-center gap-2 text-sm"
                        >
                          <span className="text-gray-400">{index + 1}.</span>
                          <code className="text-xs bg-gray-800 px-1.5 py-0.5 rounded flex-1">
                            {id}
                          </code>
                          <button
                            onClick={() => removeVideo(id)}
                            className="text-red-400 hover:text-red-300 p-1"
                            title="Xóa video này"
                          >
                            <i className="fa fa-times" />
                          </button>
                        </div>
                      ))}
                      {/* Các input nhập videoId thủ công */}
                      {manualVideoIds.map((value, idx) => (
                        <div
                          key={"manual-" + idx}
                          className="flex items-center gap-2 text-sm mt-1"
                        >
                          <input
                            type="text"
                            value={value}
                            onChange={(e) =>
                              handleManualVideoIdChange(idx, e.target.value)
                            }
                            placeholder="Nhập videoId (11 ký tự)"
                            className="w-32 p-1 bg-gray-800 border border-gray-600 rounded text-gray-200 text-xs"
                            maxLength={11}
                          />
                          <button
                            onClick={() => removeVideo(value)}
                            className="text-red-400 hover:text-red-300 p-1"
                            title="Xóa video này"
                          >
                            <i className="fa fa-times" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={addManualVideoInput}
                      className="mt-2 px-2 py-1 bg-blue-700 text-white rounded text-xs hover:bg-blue-800 flex items-center gap-1"
                    >
                      <i className="fa fa-plus" /> Thêm video
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {backgroundSettings.type === "image" && (
            <div className="space-y-4 p-6 bg-black/30 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl">
              <div className="space-y-2">
                <label
                  htmlFor="imageUrl"
                  className="block text-sm font-medium text-gray-200"
                >
                  URL ảnh nền
                </label>
                <input
                  id="imageUrl"
                  type="text"
                  value={backgroundSettings.imageUrl}
                  onChange={(e) => {
                    const newUrl = e.target.value;
                    setBackgroundSettings((prev) => ({
                      ...prev,
                      imageUrl: newUrl,
                    }));
                    setPreviewImageUrl(newUrl);
                  }}
                  placeholder="https://example.com/image.jpg"
                  className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-gray-200 text-sm"
                />
                <div className="text-xs text-gray-400 mt-1">
                  Nhập URL của ảnh nền. Ảnh sẽ được căn giữa và tự động co dãn
                  để phủ toàn màn hình.
                </div>
              </div>

              {backgroundSettings.imageUrl && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-200 mb-2">
                    Xem trước:
                  </p>
                  <div className="relative w-full h-32">
                    <Image
                      src={
                        previewImageUrl ||
                        'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24"><path fill="%23666" d="M21 5v6.59l-3-3.01-4 4.01-4-4-4 4-3-3.01V5h18zm-3 6.42l3 3.01V19H3v-5.58l3 2.99 4-4 4 4 4-4 3 3.01z"/></svg>'
                      }
                      alt="Background preview"
                      className="rounded-lg border border-gray-700"
                      fill
                      style={{ objectFit: "cover" }}
                      onError={() => {
                        setPreviewImageUrl(
                          'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24"><path fill="%23666" d="M21 5v6.59l-3-3.01-4 4.01-4-4-4 4-3-3.01V5h18zm-3 6.42l3 3.01V19H3v-5.58l3 2.99 4-4 4 4 4-4 3 3.01z"/></svg>'
                        );
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="pt-4">
            <Button
              onClick={saveSettings}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 flex items-center gap-2"
            >
              <i className="fa fa-save w-4 h-4" />
              Lưu cài đặt
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
