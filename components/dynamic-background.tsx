//Tôi là An Kun
"use client";
import { useEffect, useState, useMemo } from "react";
import "./dynamic-background.css";

// Define or import these according to your project structure
type BackgroundSettings = {
  type: "video" | "color";
  videoUrl?: string;
  videoList?: string[];
  randomVideo?: boolean;
  enableSound: boolean;
  opacity: number;
};

const DEFAULT_BACKGROUND_SETTINGS: BackgroundSettings = {
  type: "video",
  videoUrl: "",
  videoList: [],
  randomVideo: false,
  enableSound: false,
  opacity: 0.5,
};

const BACKGROUND_SETTINGS_KEY = "backgroundSettings";
const FALLBACK_VIDEOS = ["jfKfPfyJRdk", "M7lc1UVf-VE", "2Vv-BfVoq4g"]; // Lofi music videos

function getRandomVideoId(list: string[]): string {
  return list[Math.floor(Math.random() * list.length)];
}

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/
  );
  return match ? match[1] : null;
}

// Dummy SoundControl component for demonstration; replace with your actual implementation
const SoundControl = ({
  enableSound,
  onSoundToggle,
}: {
  enableSound: boolean;
  onSoundToggle: (enable: boolean) => void;
}) => (
  <button
    className="sound-control-btn"
    onClick={() => onSoundToggle(!enableSound)}
    aria-label={enableSound ? "Mute background" : "Unmute background"}
  >
    {enableSound ? "🔊" : "🔇"}
  </button>
);

export function DynamicBackground() {
  // You may need to import useMemo, and define the following constants/types elsewhere:
  // - BackgroundSettings, DEFAULT_BACKGROUND_SETTINGS, BACKGROUND_SETTINGS_KEY, FALLBACK_VIDEOS, getRandomVideoId, getYouTubeId, SoundControl

  const [settings, setSettings] = useState<BackgroundSettings | null>(null);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadSettings = () => {
      try {
        const savedSettings = localStorage.getItem(BACKGROUND_SETTINGS_KEY);
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          // Validate parsed settings có đủ fields cần thiết
          if (parsed && typeof parsed === "object") {
            setSettings({
              ...DEFAULT_BACKGROUND_SETTINGS,
              ...parsed,
            });
          } else {
            console.warn("Invalid background settings format, using defaults");
            setSettings(DEFAULT_BACKGROUND_SETTINGS);
          }
        } else {
          // Sử dụng cài đặt mặc định từ file constants
          setSettings(DEFAULT_BACKGROUND_SETTINGS);
        }
      } catch (error) {
        console.error("Failed to load or parse background settings:", error);
        setSettings(DEFAULT_BACKGROUND_SETTINGS); // Fallback về mặc định nếu có lỗi
      }
    };

    loadSettings();

    // Lắng nghe sự kiện cập nhật background từ trang Settings
    const handleBackgroundUpdate = (event: CustomEvent<BackgroundSettings>) =>
      setSettings(event.detail);
    window.addEventListener(
      "backgroundUpdate",
      handleBackgroundUpdate as EventListener
    );
    return () =>
      window.removeEventListener(
        "backgroundUpdate",
        handleBackgroundUpdate as EventListener
      );
  }, []);

  const updateSoundSetting = (enableSound: boolean) => {
    if (settings) {
      const updatedSettings = { ...settings, enableSound };
      setSettings(updatedSettings);
      localStorage.setItem(
        BACKGROUND_SETTINGS_KEY,
        JSON.stringify(updatedSettings)
      );

      // Cập nhật âm thanh của video iframe hiện tại
      const iframe = document.querySelector(
        'iframe[title="YouTube Background Video"]'
      ) as HTMLIFrameElement;
      if (iframe?.contentWindow) {
        try {
          // Luôn giữ video bị tắt tiếng, bất kể người dùng đã chọn gì
          iframe.contentWindow.postMessage(
            '{"event":"command","func":"mute","args":""}',
            "https://www.youtube.com"
          );
        } catch (e) {
          console.warn("Could not update video sound:", e);
        }
      }

      // Dispatch event để cập nhật các components khác
      window.dispatchEvent(
        new CustomEvent("backgroundUpdate", {
          detail: updatedSettings,
        })
      );
    }
  };

  // Tính toán opacity class dựa trên settings
  const getOpacityClass = (opacity: number) => {
    const adjustedOpacity = Math.max(0.1, Math.min(0.9, 1 - opacity));
    if (adjustedOpacity <= 0.1) return "opacity-10";
    if (adjustedOpacity <= 0.2) return "opacity-20";
    if (adjustedOpacity <= 0.3) return "opacity-30";
    if (adjustedOpacity <= 0.4) return "opacity-40";
    if (adjustedOpacity <= 0.5) return "opacity-50";
    if (adjustedOpacity <= 0.6) return "opacity-60";
    if (adjustedOpacity <= 0.7) return "opacity-70";
    if (adjustedOpacity <= 0.8) return "opacity-80";
    return "opacity-90";
  };

  const videoId = useMemo(() => {
    if (!settings) return null;

    let selectedVideoId: string | null = null;

    if (
      settings.randomVideo &&
      settings.videoList &&
      settings.videoList.length > 0
    ) {
      selectedVideoId = getRandomVideoId(settings.videoList);
    } else if (settings.videoUrl && settings.videoUrl.trim() !== "") {
      selectedVideoId = getYouTubeId(settings.videoUrl);
    } else if (settings.videoList && settings.videoList.length > 0) {
      // Fallback: nếu không có video nào được chỉ định, dùng video đầu tiên trong list
      selectedVideoId = settings.videoList[0];
    }

    // Final fallback: nếu vẫn không có video hợp lệ, dùng fallback video
    if (!selectedVideoId) {
      selectedVideoId = FALLBACK_VIDEOS[0];
    }

    return selectedVideoId;
  }, [settings?.randomVideo, settings?.videoUrl, settings?.videoList]);

  // Handler để xử lý user interaction
  const handleUserInteraction = () => {
    setHasUserInteracted(true);
    setHasError(false); // Reset error state on interaction
    // Force reload iframe với delay để đảm bảo autoplay
    setTimeout(() => setIframeKey((prev) => prev + 1), 300);
  };

  // Effect để đảm bảo video autoplay sau khi user có interaction
  useEffect(() => {
    if (hasUserInteracted) return;

    // Listen for user interactions with passive events
    const events = ["click", "touchstart", "keydown", "mousedown"];
    events.forEach((event) => {
      document.addEventListener(event, handleUserInteraction, {
        once: true,
        passive: true,
      });
    });
    
    // Separate scroll listener
    document.addEventListener("scroll", handleUserInteraction, {
      once: true,
      passive: true,
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleUserInteraction);
      });
      document.removeEventListener("scroll", handleUserInteraction);
    };
  }, [hasUserInteracted]);

  // Effect để auto-trigger interaction sau 2 giây nếu user chưa tương tác
  useEffect(() => {
    if (!hasUserInteracted && videoId) {
      const timer = setTimeout(handleUserInteraction, 2000);
      return () => clearTimeout(timer);
    }
  }, [hasUserInteracted, videoId]);

  if (!settings) {
    return (
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-indigo-500 to-purple-600" />
    );
  }

  // Extract the background content logic to avoid nested ternary
  let backgroundContent;
  if (settings.type === "video" && videoId) {
    if (hasError) {
      backgroundContent = (
        <div className="absolute inset-0 bg-gradient-to-br from-red-900 to-purple-900 flex items-center justify-center">
          <div className="text-white text-center">
            <p className="text-lg">Video loading failed</p>
            <p className="text-sm opacity-75">Retrying...</p>
          </div>
        </div>
      );
    } else {
      backgroundContent = (
        <iframe
          key={iframeKey}
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1&enablejsapi=1&origin=${window.location.origin}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          title="YouTube Background Video"
          onLoad={(e) => {
            const iframe = e.currentTarget;
            if (iframe?.contentWindow) {
              try {
                iframe.contentWindow.postMessage(
                  '{"event":"command","func":"mute","args":""}',
                  "https://www.youtube.com"
                );
              } catch (e) {
                console.warn("Could not mute video:", e);
              }
            }
          }}
          onError={() => {
            console.warn("YouTube iframe failed to load, trying fallback...");
            setHasError(true);
            setTimeout(() => {
              setIframeKey((prev) => prev + 1);
              setHasError(false);
            }, 2000);
          }}
        />
      );
    }
  } else {
    backgroundContent = (
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600" />
    );
  }

  return (
    <>
      <div className="fixed inset-0 -z-10">
        <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600" />
      </div>


    </>
  );
}
