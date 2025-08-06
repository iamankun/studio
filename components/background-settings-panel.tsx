"use client"

import type React from "react"
import Image from "next/image"
import { useEffect, useState, useCallback } from "react"
import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    type BackgroundSettings,
    BACKGROUND_SETTINGS_KEY,
    DEFAULT_BACKGROUND_SETTINGS,
} from "@/lib/constants"

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
]

// No props needed for this component
export function BackgroundSettingsPanel() {
    const [backgroundSettings, setBackgroundSettings] = useState<BackgroundSettings>(DEFAULT_BACKGROUND_SETTINGS)
    const [showCustomPanel, setShowCustomPanel] = useState(false)
    const [youtubeUrl, setYoutubeUrl] = useState("")
    const [overlayOpacity, setOverlayOpacity] = useState("0.5")
    const [previewImageUrl, setPreviewImageUrl] = useState(backgroundSettings.imageUrl || "")

    useEffect(() => {
        // Load background settings
        const saved = localStorage.getItem(BACKGROUND_SETTINGS_KEY)
        if (saved) {
            const settings = JSON.parse(saved)
            // Ensure all required properties have default values
            const mergedSettings = {
                ...DEFAULT_BACKGROUND_SETTINGS,
                ...settings
            }
            setBackgroundSettings(mergedSettings)
            setYoutubeUrl(mergedSettings.videoUrl ?? "")
            setOverlayOpacity(mergedSettings.opacity?.toString() ?? "0.5")
            setPreviewImageUrl(mergedSettings.imageUrl || "")
        }
    }, [])

    const saveSettings = () => {
        try {
            const newSettings = {
                ...backgroundSettings,
                opacity: parseFloat(overlayOpacity),
                videoUrl: youtubeUrl || backgroundSettings.videoUrl,
            }
            localStorage.setItem(BACKGROUND_SETTINGS_KEY, JSON.stringify(newSettings))
            setBackgroundSettings(newSettings)
            // Gửi sự kiện với tên và dữ liệu chính xác
            window.dispatchEvent(new CustomEvent("backgroundUpdate", { detail: newSettings }))
        } catch (error) {
            console.error("Failed to save background settings:", error)
        }
    }

    // Update video settings when URL changes
    const handleVideoUrlChange = (url: string) => {
        const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
        const match = regex.exec(url)
        const videoId = match ? match[1] : url

        if (videoId) {
            setYoutubeUrl(videoId)
            setBackgroundSettings(prev => ({
                ...prev,
                type: "video" as const,
                videoUrl: videoId,
                randomVideo: false
            }))
        }
    }

    // Update background settings when opacity changes
    const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newOpacity = e.target.value
        setOverlayOpacity(newOpacity)
        setBackgroundSettings(prev => ({
            ...prev,
            opacity: parseFloat(newOpacity)
        }))
    }

    // Update video random mode and video list
    const updateVideoSettings = (randomVideo: boolean) => {
        setBackgroundSettings(prev => ({
            ...prev,
            randomVideo,
            videoList: randomVideo ? DEFAULT_VIDEOS : []
        }))
    }

    // Update sound settings
    const updateSoundSettings = (enableSound: boolean) => {
        setBackgroundSettings(prev => ({
            ...prev,
            enableSound
        }))
    }

    // Hàm xóa video khỏi danh sách
    const removeVideo = (idToRemove: string) => {
        setBackgroundSettings(prev => ({
            ...prev,
            videoList: prev.videoList.filter(id => id !== idToRemove)
        }))
    }

    return (
        <div className="fixed top-16 right-4 z-50">
            <div className="bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-lg p-6 w-80 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
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
                        <label htmlFor="opacity" className="block text-sm font-medium text-gray-200">
                            Độ mờ nền
                            <span className="text-xs text-gray-400 ml-2">&nbsp;({Math.round(Number(overlayOpacity) * 100)}%)</span>
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
                        <label htmlFor="backgroundType" className="block text-sm font-medium text-gray-200">
                            Loại nền
                        </label>
                        <select
                            id="backgroundType"
                            value={backgroundSettings.type}
                            onChange={(e) => {
                                const newType = e.target.value as "gradient" | "video" | "image"
                                setBackgroundSettings(prev => ({ ...prev, type: newType }))
                            }}
                            className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-gray-200 text-sm"
                        >
                            <option value="gradient">Nền gradient</option>
                            <option value="video">Video nền</option>
                            <option value="image">Ảnh nền</option>
                        </select>
                    </div>

                    {backgroundSettings.type === "gradient" && (
                        <div className="space-y-4 bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-6">
                            <div className="space-y-2">
                                <label htmlFor="gradient" className="block text-sm font-medium text-gray-200">
                                    Chọn gradient
                                </label>
                                <select
                                    id="gradient"
                                    value={backgroundSettings.gradient}
                                    onChange={(e) => {
                                        setBackgroundSettings(prev => ({
                                            ...prev,
                                            gradient: e.target.value
                                        }))
                                    }}
                                    className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-gray-200 text-sm"
                                >
                                    <option value="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">Tím - Xanh</option>
                                    <option value="linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)">Hồng - Cam</option>
                                    <option value="linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)">Xanh - Hồng nhạt</option>
                                    <option value="linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)">Xanh lá - Xanh dương</option>
                                    <option value="linear-gradient(135deg, #f6d365 0%, #fda085 100%)">Vàng - Cam</option>
                                    <option value="linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)">Xanh lá nhạt</option>
                                    <option value="linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)">Xanh ngọc - Tím</option>
                                    <option value="linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)">Tím - Hồng</option>
                                    <option value="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">Xanh dương - Xanh ngọc</option>
                                </select>
                            </div>
                            
                            {/* Hiển thị xem trước gradient */}
                            <div className="mt-4">
                                <p className="text-sm font-medium text-gray-200 mb-2">Xem trước:</p>
                                <div 
                                    className="w-full h-32 rounded-lg border border-gray-700"
                                    style={{background: backgroundSettings.gradient}}
                                />
                            </div>
                        </div>
                    )}

                    {backgroundSettings.type === "video" && (
                        <div className="space-y-4 bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-6">
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <input
                                        id="randomVideo"
                                        type="checkbox"
                                        checked={backgroundSettings.randomVideo}
                                        onChange={(e) => updateVideoSettings(e.target.checked)}
                                        className="rounded border-gray-600"
                                    />
                                    <label htmlFor="randomVideo" className="text-sm text-gray-300">
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
                                    <label htmlFor="enableSound" className="text-sm text-gray-300">
                                        Bật âm thanh
                                    </label>
                                </div>
                            </div>

                            {showCustomPanel && (
                                <>
                                    <div className="space-y-2">
                                        <label htmlFor="youtubeUrl" className="block text-sm font-medium text-gray-200">
                                            YouTube Video ID hoặc URL
                                        </label>
                                        <input
                                            id="youtubeUrl"
                                            type="text"
                                            value={youtubeUrl}
                                            onChange={(e) => setYoutubeUrl(e.target.value)}
                                            placeholder="Ví dụ: dQw4w9WgXcQ"
                                            className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-gray-200 text-sm"
                                        />
                                        <Button
                                            onClick={() => handleVideoUrlChange(youtubeUrl)}
                                            className="w-full mt-2"
                                            size="sm"
                                        >
                                            Áp dụng video
                                        </Button>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="videoList" className="block text-sm font-medium text-gray-200">
                                            Danh sách video ngẫu nhiên
                                        </label>
                                        <div className="max-h-32 overflow-y-auto space-y-1">
                                            {backgroundSettings.videoList.map((id, index) => (
                                                <div key={id} className="flex items-center gap-2 text-sm">
                                                    <span className="text-gray-400">{index + 1}.</span>
                                                    <code className="text-xs bg-gray-800 px-1.5 py-0.5 rounded flex-1">
                                                        {id}
                                                    </code>
                                                    <button
                                                        onClick={() => removeVideo(id)}
                                                        className="text-red-400 hover:text-red-300 p-1"
                                                        title="Xóa video này"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {backgroundSettings.type === "image" && (
                        <div className="space-y-4 bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-6">
                            <div className="space-y-2">
                                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-200">
                                    URL ảnh nền
                                </label>
                                <input
                                    id="imageUrl"
                                    type="text"
                                    value={backgroundSettings.imageUrl}
                                    onChange={(e) => {
                                        const newUrl = e.target.value
                                        setBackgroundSettings(prev => ({
                                            ...prev,
                                            imageUrl: newUrl,
                                        }))
                                        setPreviewImageUrl(newUrl)
                                    }}
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-gray-200 text-sm"
                                />
                                <div className="text-xs text-gray-400 mt-1">
                                    Nhập URL của ảnh nền. Ảnh sẽ được căn giữa và tự động co dãn để phủ toàn màn hình.
                                </div>
                            </div>

                            {backgroundSettings.imageUrl && (
                                <div className="mt-4">
                                    <p className="text-sm font-medium text-gray-200 mb-2">Xem trước:</p>
                                    <div className="relative w-full h-32">
                                        <Image
                                            src={previewImageUrl || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24"><path fill="%23666" d="M21 5v6.59l-3-3.01-4 4.01-4-4-4 4-3-3.01V5h18zm-3 6.42l3 3.01V19H3v-5.58l3 2.99 4-4 4 4 4-4 3 3.01z"/></svg>'}
                                            alt="Background preview"
                                            className="rounded-lg border border-gray-700"
                                            fill
                                            style={{ objectFit: 'cover' }}
                                            onError={() => {
                                                setPreviewImageUrl('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24"><path fill="%23666" d="M21 5v6.59l-3-3.01-4 4.01-4-4-4 4-3-3.01V5h18zm-3 6.42l3 3.01V19H3v-5.58l3 2.99 4-4 4 4 4-4 3 3.01z"/></svg>')
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
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            Lưu cài đặt
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
