"use client";

import type React from "react";
import styles from "./background-system.module.css";
import { useEffect, useState } from "react";

const DEFAULT_VIDEOS = [
  "dQw4w9WgXcQ", // Rick Astley - Never Gonna Give You Up
  "kJQP7kiw5Fk", // Despacito
  "fJ9rUzIMcZQ", // Bohemian Rhapsody
  "9bZkp7q19f0", // Gangnam Style
  "hTWKbfoikeg", // Smells Like Teen Spirit
  "YQHsXMglC9A", // Hello - Adele
  "CevxZvSJLk8", // Katy Perry - Roar
  "JGwWNGJdvx8", // Shape of You
  "RgKAFK5djSk", // Wiz Khalifa - See You Again
  "OPf0YbXqDm0", // Mark Ronson - Uptown Funk
];

export function BackgroundSystem() {
  // State lưu log từ bảng nhatKy
  const [logs, setLogs] = useState<
    Array<{ id: string; action: string; createdAt: string }>
  >([]);

  // State cho background
  const [backgroundSettings, setBackgroundSettings] = useState({
    type: "gradient",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    videoUrl: "",
    imageUrl: "",
    opacity: 0.3,
    randomVideo: true,
    videoList: DEFAULT_VIDEOS,
  });

  // Hàm fetch log từ API hoặc service (giả sử có endpoint /api/nhatky)
  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch("/api/nhatky");
        if (res.ok) {
          const data = await res.json();
          setLogs(data);
        }
      } catch (err) {
        // Có thể log lỗi ra console nếu cần
      }
    }
    fetchLogs();
  }, []);

  const [currentVideo, setCurrentVideo] = useState("");
  const [textStyleDialogOpen, setTextStyleDialogOpen] = useState(false);
  const [currentTextInput, setCurrentTextInput] = useState<
    "Tiêu đề" | "Phụ đề" | null
  >(null);
  const [titleStyle, setTitleStyle] = useState<{
    gradient: string;
    animation: string;
    font: string | undefined;
  }>({ gradient: "", animation: "", font: "" });
  const [subtitleStyle, setSubtitleStyle] = useState<{
    gradient: string;
    animation: string;
    font: string | undefined;
  }>({ gradient: "", animation: "", font: "" });

  useEffect(() => {
    // Load background settings
    const saved = localStorage.getItem("backgroundSettings_v2");
    if (saved) {
      const settings = JSON.parse(saved);
      setBackgroundSettings(settings);
    }

    // Listen for background updates
    const handleBackgroundUpdate = (event: CustomEvent) => {
      setBackgroundSettings(event.detail);
    };

    window.addEventListener(
      "backgroundUpdate",
      handleBackgroundUpdate as EventListener
    );
    return () => {
      window.removeEventListener(
        "backgroundUpdate",
        handleBackgroundUpdate as EventListener
      );
    };
  }, []);

  useEffect(() => {
    if (backgroundSettings.type === "video" && backgroundSettings.randomVideo) {
      if (backgroundSettings.videoList.length === 1) {
        // Nếu chỉ có 1 video thì phát luôn video đó
        setCurrentVideo(backgroundSettings.videoList[0]);
      } else if (backgroundSettings.videoList.length > 1) {
        // Nếu có nhiều video thì random
        const randomIndex = Math.floor(
          Math.random() * backgroundSettings.videoList.length
        );
        setCurrentVideo(backgroundSettings.videoList[randomIndex]);
      } else {
        setCurrentVideo("");
      }
    } else if (
      backgroundSettings.type === "video" &&
      backgroundSettings.videoUrl
    ) {
      const videoId = extractYoutubeId(backgroundSettings.videoUrl);
      setCurrentVideo(videoId ?? "");
    }
  }, [backgroundSettings]);

  const extractYoutubeId = (url: string) => {
    const regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = regExp.exec(url);
    return match && match[7].length === 11 ? match[7] : null;
  };

  return (
    <div className="fixed inset-0 -z-10">
      {backgroundSettings.type === "video" && currentVideo && (
        <iframe
          src={`https://www.youtube.com/embed/${currentVideo}?autoplay=1&mute=1&controls=0&loop=1&playlist=${currentVideo}&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1&enablejsapi=1&origin=${window.location.origin}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          className={styles["background-video"]}
          title={`Background YouTube video ${currentVideo}`}
          style={
            {
              // Sử dụng biến CSS cho opacity
              "--bg-opacity": backgroundSettings.opacity,
            } as React.CSSProperties
          }
        />
      )}
      {backgroundSettings.type === "gradient" && (
        <div
          className={`absolute inset-0 transition-opacity duration-1000 background-gradient ${styles["background-gradient"]}`}
          data-gradient={backgroundSettings.gradient}
          style={
            {
              "--bg-opacity": backgroundSettings.opacity,
            } as React.CSSProperties
          }
        />
      )}
      {backgroundSettings.type === "image" && backgroundSettings.imageUrl && (
        <div
          className={`absolute inset-0 bg-center bg-cover transition-opacity duration-1000 ${styles["background-image"]}`}
          data-bg={backgroundSettings.imageUrl}
          style={
            {
              backgroundImage: `url(${backgroundSettings.imageUrl})`,
              "--bg-opacity": backgroundSettings.opacity,
            } as React.CSSProperties
          }
        />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />
      {/* Hiển thị log từ bảng nhatKy */}
      {logs.length > 0 && (
        <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white text-xs p-2 z-50 max-h-40 overflow-y-auto">
          <div className="font-bold mb-1">Lịch sử hoạt động nền:</div>
          <ul>
            {logs.map((log) => (
              <li key={log.id} className="mb-1">
                <span className="text-yellow-300">{log.action}</span>{" "}
                <span className="text-gray-400">
                  ({new Date(log.createdAt).toLocaleString()})
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Move TextStyleDialog outside and pass props
type TextStyleDialogProps = {
  open: boolean;
  currentTextInput: "title" | "subtitle" | null;
  titleStyle: { gradient: string; animation: string; font: string };
  subtitleStyle: { gradient: string; animation: string; font: string };
  onClose: () => void;
};

export function TextStyleDialog({
  open,
  currentTextInput,
  titleStyle,
  subtitleStyle,
  onClose,
}: TextStyleDialogProps) {
  if (!open) return null;

  const gradientOptions = [
    {
      name: "Tím",
      class:
        "bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent",
    },
    {
      name: "Xanh dương",
      class:
        "bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent",
    },
    {
      name: "Xanh lá",
      class:
        "bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent",
    },
    {
      name: "Vàng",
      class:
        "bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent",
    },
  ];

  const animationOptions = [
    { name: "Không", class: "" },
    { name: "Nhảy", class: "animate-pulse" },
    { name: "Nảy", class: "animate-bounce" },
    { name: "Vút", class: "animate-ping" },
  ];

  const fontOptions = [
    { name: "Bình thường", class: "font-dosis" },
    { name: "Nhẹ", class: "font-dosis-light" },
    { name: "Vừa", class: "font-dosis-medium" },
    { name: "Đậm", class: "font-dosis-bold" },
    { name: "Rất đậm", class: "font-dosis-extrabold" },
  ];

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">
            Tùy chỉnh{" "}
            {currentTextInput === "title"
              ? "Tiêu đề"
              : currentTextInput === "subtitle"
                ? "Phụ đề"
                : ""}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="gradient-select"
              className="text-sm font-medium text-gray-300 block mb-2"
            >
              Gradient màu:
            </label>
            <div id="gradient-select" className="grid grid-cols-2 gap-2">
              {gradientOptions.map((option) => (
                <button
                  type="button"
                  key={option.name}
                  onClick={() =>
                    applyTextStyle({
                      gradient: option.class,
                      animation:
                        currentTextInput === "title"
                          ? titleStyle.animation
                          : subtitleStyle.animation,
                      font:
                        currentTextInput === "title"
                          ? titleStyle.font
                          : subtitleStyle.font,
                    })
                  }
                  className="p-2 border border-gray-600 rounded text-xs hover:bg-gray-700"
                >
                  <span className={option.class}>{option.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="animation-select"
              className="text-sm font-medium text-gray-300 block mb-2"
            >
              Animation:
            </label>
            <div id="animation-select" className="grid grid-cols-2 gap-2">
              {animationOptions.map((option) => (
                <button
                  type="button"
                  key={option.name}
                  onClick={() =>
                    applyTextStyle({
                      gradient:
                        currentTextInput === "title"
                          ? titleStyle.gradient
                          : subtitleStyle.gradient,
                      animation: option.class,
                      font:
                        currentTextInput === "title"
                          ? titleStyle.font
                          : subtitleStyle.font,
                    })
                  }
                  className="p-2 border border-gray-600 rounded text-xs hover:bg-gray-700 text-gray-200"
                >
                  {option.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="font-select"
              className="text-sm font-medium text-gray-300 block mb-2"
            >
              Font weight:
            </label>
            <div id="font-select" className="grid grid-cols-2 gap-2">
              {fontOptions.map((option) => (
                <button
                  type="button"
                  key={option.name}
                  onClick={() =>
                    applyTextStyle({
                      gradient:
                        currentTextInput === "title"
                          ? titleStyle.gradient
                          : subtitleStyle.gradient,
                      animation:
                        currentTextInput === "title"
                          ? titleStyle.animation
                          : subtitleStyle.animation,
                      font: option.class,
                    })
                  }
                  className="p-2 border border-gray-600 rounded text-xs hover:bg-gray-700 text-gray-200"
                >
                  <span className={option.class}>{option.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
