"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeToggle } from "@/components/theme-toggle"
import { logUIInteraction, logSubmissionActivity } from "@/lib/client-activity-log"
import type { User } from "@/types/user"
import type {
  Submission,
  TrackInfo,
  AdditionalArtist,
  MainCategory,
  SubCategory,
  ReleaseType,
  CopyrightOwnershipStatus,
  ReleaseHistoryStatus,
  LyricsStatus,
  Platform,
  ArtistPrimaryRole,
  AdditionalArtistRole,
  PrismaSubmission,
  PrismaTrack,
  convertLegacySubmissionToPrisma
} from "@/types/submission"
import { PrismaReleaseType, PrismaSubmissionStatus } from "@/types/submission"
import {
  Rocket,
  UserIcon,
  Disc3,
  UploadIcon,
  Play,
  Pause,
  Plus,
  Trash2,
  X,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { validateImageFile, validateAudioFile, getMinimumReleaseDate } from "@/lib/utils"
import { multiDB } from "@/lib/database-api-service"

interface AudioTrack {
  file: File
  info: TrackInfo
  id: string
}

interface UploadFormViewProps {
  onSubmissionAdded: (submission: Submission) => void
  showModal: (title: string, messages: string[], type?: "error" | "success") => void
}

export default function UploadFormView({ onSubmissionAdded, showModal }: Readonly<UploadFormViewProps>) {
  const { user: currentUser } = useAuth();

  // Form state - initialize with safe defaults
  const [fullName, setFullName] = useState("")
  const [artistName, setArtistName] = useState("")
  const [artistRole, setArtistRole] = useState<ArtistPrimaryRole>("singer")
  const [songTitle, setSongTitle] = useState("")
  const [albumName, setAlbumName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [mainCategory, setMainCategory] = useState<MainCategory>("pop")
  const [subCategory, setSubCategory] = useState<SubCategory>("official")
  const [releaseType, setReleaseType] = useState<ReleaseType>("single")
  const [isCopyrightOwner, setIsCopyrightOwner] = useState<CopyrightOwnershipStatus>("yes")
  const [hasBeenReleased, setHasBeenReleased] = useState<ReleaseHistoryStatus>("no")
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [hasLyrics, setHasLyrics] = useState<LyricsStatus>("no")
  const [lyrics, setLyrics] = useState("")
  const [releaseDate, setReleaseDate] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [lastISRCCounter, setLastISRCCounter] = useState(1000)

  // File states
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("")
  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>([])

  // Hiển thị player
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null)
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({})

  // Lựa chọn ngày phát hành tối thiểu và thông tin người dùng
  useEffect(() => {
    setReleaseDate(getMinimumReleaseDate())
    if (currentUser) {
      setFullName(currentUser.fullName ?? "")
      setArtistName(currentUser.role === "Artist" ? currentUser.username : "")
      setUserEmail(currentUser.email ?? "")
    }
  }, [currentUser])

  if (!currentUser) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Đang tải thông tin</h2>
          <p className="text-gray-500">Vui lòng chờ trong giây lát...</p>
        </div>
      </div>
    );
  }

  // Additional artist management functions
  const addAdditionalArtist = (trackId: string) => {
    setAudioTracks(prev =>
      prev.map((track) => {
        if (track.id === trackId) {
          return {
            ...track,
            info: {
              ...track.info,
              additionalArtists: [
                ...track.info.additionalArtists,
                {
                  name: "",
                  fullName: "",
                  role: "featuring" as AdditionalArtistRole,
                  percentage: 0
                }
              ]
            }
          }
        }
        return track
      })
    )
  }

  const removeAdditionalArtist = (trackId: string, artistIndex: number) => {
    setAudioTracks(prev =>
      prev.map((track) => {
        if (track.id === trackId) {
          return {
            ...track,
            info: {
              ...track.info,
              additionalArtists: track.info.additionalArtists.filter((_, index) => index !== artistIndex)
            }
          }
        }
        return track
      })
    )
  }

  const updateAdditionalArtist = (trackId: string, artistIndex: number, field: keyof AdditionalArtist, value: string | number) => {
    setAudioTracks(prev =>
      prev.map((track) => {
        if (track.id === trackId) {
          return {
            ...track,
            info: {
              ...track.info,
              additionalArtists: track.info.additionalArtists.map((artist, index) => {
                if (index === artistIndex) {
                  return { ...artist, [field]: value }
                }
                return artist
              })
            }
          }
        }
        return track
      })
    )
  }

  // Audio playback functions
  const toggleAudioPlayback = (trackId: string, audioUrl: string) => {
    if (currentlyPlaying === trackId) {
      // Pause current track
      audioRefs.current[trackId]?.pause()
      setCurrentlyPlaying(null)
    } else {
      // Stop any currently playing track
      if (currentlyPlaying) {
        audioRefs.current[currentlyPlaying]?.pause()
      }

      // Play new track
      if (!audioRefs.current[trackId]) {
        audioRefs.current[trackId] = new Audio(audioUrl)
        audioRefs.current[trackId].addEventListener('ended', () => {
          setCurrentlyPlaying(null)
        })
      }

      audioRefs.current[trackId].play()
      setCurrentlyPlaying(trackId)
    }
  }

  // Platform selection handlers
  const handlePlatformChange = (platform: Platform, checked: boolean) => {
    if (checked) {
      setPlatforms(prev => [...prev, platform])
    } else {
      setPlatforms(prev => prev.filter(p => p !== platform))
    }
  }

  // File upload handlers
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target
    const file = files?.[0]
    if (!file) {
      return
    }

    try {
      const validation = await validateImageFile(file)
      if (!validation.valid) {
        showModal("Lỗi", validation.errors, "error")
        return
        }

      setImageFile(file)
      setImagePreviewUrl(URL.createObjectURL(file))
    } catch (error) {
      showModal("Lỗi", ["Có lỗi xảy ra khi tải ảnh"], "error")
    }
  }

  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target
    if (!files || files.length === 0) {
      return
    }

    Array.from(files).forEach(async (file) => {
      try {
        const validation = validateAudioFile(file)
        if (!validation.valid) {
          showModal("Lỗi", [`${file.name}: ${validation.errors.join(", ")}`], "error")
          return
        }
        
        // Không tự động tạo ISRC khi upload track
        // ISRC sẽ được tạo ở giai đoạn release hoặc người dùng có thể nhập ISRC cũ
        const trackId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

        const newTrack: AudioTrack = {
          file,
          id: trackId,
          info: {
            fileName: file.name,
            isrc: "", // Để trống, sẽ điền sau
            songTitle: file.name.replace(/\.[^/.]+$/, ""), // Default to filename without extension
            artistName: artistName,
            artistFullName: fullName,
            additionalArtists: []
          }
        }

        setAudioTracks(prev => [...prev, newTrack])
      } catch (error) {
        showModal("Lỗi", [`Có lỗi xảy ra khi tải file ${file.name}`], "error")
      }
    })
  }

  const removeAudioTrack = (trackId: string) => {
    setAudioTracks(prev => prev.filter(track => track.id !== trackId))
    if (currentlyPlaying === trackId) {
      audioRefs.current[trackId]?.pause()
      setCurrentlyPlaying(null)
    }
    if (audioRefs.current[trackId]) {
      URL.revokeObjectURL(audioRefs.current[trackId].src)
      delete audioRefs.current[trackId]
    }
  }

  // ISRC Management Functions
  const generateISRC = (user: User, lastCounter: number) => {
    // Định dạng: VNA2P2500001
    // VN - Mã quốc gia cho Việt Nam
    // A2P - Mã nhà phát hành cho An Kun Studio
    // 25 - Năm (2025)
    // 00001 - Số thứ tự 5 chữ số

    const newCounter = lastCounter + 1
    const year = new Date().getFullYear().toString().slice(2)
    const isrc = `VNA2P${year}${String(newCounter).padStart(5, "0")}`

    return {
      isrc,
      newCounter,
    }
  }

  // Update ISRC for a specific track
  const updateTrackISRC = (trackId: string, isrc: string) => {
    setAudioTracks(prev =>
      prev.map((track) => {
        if (track.id === trackId) {
          return {
            ...track,
            info: {
              ...track.info,
              isrc: isrc
            }
          }
        }
        return track
      })
    )
  }

  // Generate ISRC for all tracks that don't have one (called during submission)
  const generateISRCForAllTracks = () => {
    let counter = lastISRCCounter
    
    setAudioTracks(prev =>
      prev.map((track) => {
        if (!track.info.isrc || track.info.isrc === "") {
          const { isrc, newCounter } = generateISRC(currentUser, counter)
          counter = newCounter
          return {
            ...track,
            info: {
              ...track.info,
              isrc: isrc
            }
          }
        }
        return track
      })
    )
    
    setLastISRCCounter(counter)
  }

  // Form submission handler
  const handleSubmit = async () => {
    // Validation
    const validationErrors = [];

    // Check required fields
    if (!songTitle.trim()) {
      validationErrors.push("Vui lòng nhập tên bài hát");
    }
    if (!artistName.trim()) {
      validationErrors.push("Vui lòng nhập tên nghệ sĩ");
    }
    if (!fullName.trim()) {
      validationErrors.push("Vui lòng nhập họ tên đầy đủ");
    }
    if (!userEmail.trim()) {
      validationErrors.push("Vui lòng nhập email");
    }
    if (!userEmail.includes('@')) {
      validationErrors.push("Email không hợp lệ");
    }
    if (audioTracks.length === 0) {
      validationErrors.push("Vui lòng upload ít nhất một file nhạc");
    }
    if (!imageFile) {
      validationErrors.push("Vui lòng upload ảnh bìa");
    }
    if (!releaseDate) {
      validationErrors.push("Vui lòng chọn ngày phát hành");
    }

    // Check for empty required fields in audio tracks
    const invalidTracks = audioTracks.filter(track => !track.info.songTitle.trim());
    if (invalidTracks.length > 0) {
      validationErrors.push(`${invalidTracks.length} track chưa có tên bài hát`);
    }

    // Special validation for additional artists if present
    audioTracks.forEach(track => {
      track.info.additionalArtists.forEach((artist, index) => {
        if (!artist.name.trim()) {
          validationErrors.push(`Track "${track.info.songTitle}": Nghệ sĩ phối hợp #${index + 1} chưa có tên`);
        }
      });
    });

    if (validationErrors.length > 0) {
      showModal("Lỗi", validationErrors, "error");
      return;
    }

    setIsUploading(true);

    try {
      // Log the start of submission process
      logUIInteraction('form', 'upload-submission-form', {
        trackCount: audioTracks.length,
        hasImage: !!imageFile,
        mainCategory,
        subCategory,
        releaseType
      });

      // Generate ISRC for tracks that don't have one yet
      generateISRCForAllTracks();

      // Wait a bit for state to update
      await new Promise(resolve => setTimeout(resolve, 100));

      // Get the first track's ISRC for the image upload (legacy compatibility)
      const firstTrackISRC = audioTracks[0]?.info.isrc || `VNA2P${new Date().getFullYear().toString().slice(2)}00001`;

      // Upload ảnh bìa
      const imageFormData = new FormData();
      if (imageFile) {
        imageFormData.append("file", imageFile);
      }
      imageFormData.append("type", "image");
      imageFormData.append("userId", currentUser.id);
      imageFormData.append("artistName", artistName);
      imageFormData.append("songTitle", songTitle);
      imageFormData.append("isrc", firstTrackISRC);

      const imageResponse = await fetch("/api/upload", {
        method: "POST",
        body: imageFormData,
      });

      const imageResult = await imageResponse.json();
      if (!imageResult.success) {
        throw new Error(`Lỗi upload ảnh: ${imageResult.message}`);
      }

      // Upload các file âm thanh và tạo track data
      const tracksData: Omit<PrismaTrack, 'id' | 'createdAt' | 'updatedAt' | 'submissionId'>[] = [];
      
      for (const track of audioTracks) {
        const audioFormData = new FormData();
        audioFormData.append("file", track.file);
        audioFormData.append("type", "audio");
        audioFormData.append("userId", currentUser.id);
        audioFormData.append("artistName", artistName);
        audioFormData.append("songTitle", track.info.songTitle);
        audioFormData.append("isrc", track.id);

        const audioResponse = await fetch("/api/upload", {
          method: "POST",
          body: audioFormData,
        });

        const audioResult = await audioResponse.json();
        if (!audioResult.success) {
          throw new Error(`Lỗi upload âm thanh ${track.file.name}: ${audioResult.message}`);
        }

        // Tạo dữ liệu track cho cấu trúc Prisma
        tracksData.push({
          title: track.info.songTitle,
          artist: track.info.artistName,
          filePath: audioResult.url,
          duration: track.info.duration || 0,
          isrc: track.id,
          fileName: track.file.name,
          artistFullName: track.info.artistFullName,
          fileSize: track.file.size,
          format: track.file.type,
          bitrate: null, // Sẽ được điền bởi xử lý bitrate
          sampleRate: null, // Sẽ được điền bởi xử lý GHz
          mainCategory: track.info.mainCategory || null,
          subCategory: track.info.subCategory || null,
          lyrics: track.info.lyrics || null
        });
      }

      // Convert release type to Prisma enum
      const prismaReleaseType: PrismaReleaseType = 
        releaseType === 'single' ? PrismaReleaseType.SINGLE :
        releaseType === 'ep' ? PrismaReleaseType.EP :
        releaseType === 'album' ? PrismaReleaseType.ALBUM :
        releaseType === 'lp' ? PrismaReleaseType.ALBUM :
        PrismaReleaseType.SINGLE;

      // Tạo yêu cầu dữ liệu cho cấu trúc Prisma
      const submissionData: Omit<PrismaSubmission, 'id' | 'createdAt' | 'updatedAt'> = {
        title: songTitle,
        artist: artistName,
        UPC: null, // Điền sau bởi hãng
        type: prismaReleaseType,
        coverImagePath: imageResult.url,
        releaseDate: new Date(releaseDate),
        status: PrismaSubmissionStatus.PENDING,
        metadataLocked: false,
        published: false,
        albumName: albumName || null,
        mainCategory: mainCategory,
        subCategory: subCategory || null,
        platforms: hasBeenReleased === "yes" ? { platforms } : null,
        distributionLink: null,
        distributionPlatforms: null,
        statusVietnamese: "Đã nhận, đang chờ duyệt",
        rejectionReason: null,
        notes: hasLyrics === "yes" ? lyrics : null,
        // Signature fields
        signedDocumentPath: null,
        signedAt: null,
        signerFullName: null,
        isDocumentSigned: false,
        userId: currentUser.id,
        labelId: currentUser.id // Dùng ID của user hiện tại
      };

      // Dùng mới dữ liệu dịch vụ
      const result = await multiDB.createSubmissionWithTracks(submissionData, tracksData);

      if (!result.success) {
        throw new Error(result.message || "Không thể tạo submission");
      }

      // Chuyển đổi về định dạng cũ để tương thích ngược
      const legacySubmission: Submission = {
        id: result.data!.submission.id,
        userId: currentUser.id,
        isrc: tracksData[0]?.isrc || "",
        uploaderUsername: currentUser.username,
        artistName,
        songTitle,
        albumName,
        userEmail,
        imageFile: imageFile?.name ?? "",
        imageUrl: imageResult.url,
        audioUrl: tracksData.length === 1 ? tracksData[0].filePath : undefined,
        audioUrls: tracksData.map(track => track.filePath),
        audioFilesCount: tracksData.length,
        status: "Đã nhận, đang chờ duyệt",
        submissionDate: new Date().toISOString(),
        mainCategory,
        subCategory,
        releaseType,
        isCopyrightOwner,
        hasBeenReleased,
        platforms: hasBeenReleased === "yes" ? platforms : [],
        hasLyrics,
        lyrics: hasLyrics === "yes" ? lyrics : "",
        releaseDate,
        artistRole,
        fullName,
        additionalArtists: [],
        trackInfos: audioTracks.map(track => track.info),
      };

      onSubmissionAdded(legacySubmission);

      // Ghi nhật ký hoạt động
      logSubmissionActivity(result.data!.submission.id, 'create', 'success', {
        artistName,
        songTitle,
        trackCount: tracksData.length,
        mainCategory,
        subCategory,
        releaseType,
        releaseDate
      });

      // Làm mới biểu mẫu
      resetForm();

      showModal("Thành công", ["Đã gửi bài hát để chờ duyệt!"], "success");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Có lỗi xảy ra khi gửi bài hát";

      // Ghi nhật ký lỗi không xác định
      logSubmissionActivity('Không xác định', 'create', 'error', {
        artistName,
        songTitle,
        error: errorMessage,
        trackCount: audioTracks.length
      });

      showModal("Lỗi", [errorMessage], "error");
    } finally {
      setIsUploading(false);
    }
  }

  const resetForm = () => {
    setArtistName(currentUser.role === "Artist" ? currentUser.username : "")
    setSongTitle("")
    setAlbumName("")
    setUserEmail(currentUser.email ?? "")
    setMainCategory("pop")
    setSubCategory("official")
    setReleaseType("single")
    setIsCopyrightOwner("yes")
    setHasBeenReleased("no")
    setPlatforms([])
    setHasLyrics("no")
    setLyrics("")
    setImageFile(null)
    setImagePreviewUrl("")
    setAudioTracks([])
    setReleaseDate(getMinimumReleaseDate())
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 p-4">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">🎵 Upload nhạc để phát hành toàn cầu</h1>
            <p className="text-muted-foreground">{process.env.COMPANY_DESCRIPTION}</p>
          </div>
          <div className="flex items-center">
            <ThemeToggle/>
          </div>
        </div>

        <Tabs
          defaultValue="basic"
          className="w-full"
          onValueChange={(value) => {
            logUIInteraction('tab', value as any, {
              formStep: value
            });
          }}
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              Thông tin cơ bản
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-2">
              <UploadIcon className="h-4 w-4" />
              Media Files
            </TabsTrigger>
            <TabsTrigger value="metadata" className="flex items-center gap-2">
              <Disc3 className="h-4 w-4" />
              Metadata
            </TabsTrigger>
            <TabsTrigger value="release" className="flex items-center gap-2">
              <Rocket className="h-4 w-4" />
              Phát hành
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-xl font-semibold mb-4">Thông tin nghệ sĩ</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Họ và tên đầy đủ *</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ví dụ: Nguyễn Mạnh A"
                    />
                  </div>

                  <div>
                    <Label htmlFor="artistName">Tên nghệ sĩ *</Label>
                    <Input
                      id="artistName"
                      value={artistName}
                      onChange={(e) => setArtistName(e.target.value)}
                      placeholder="Ví dụ: An Kun"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="userEmail">Email *</Label>
                    <Input
                      id="userEmail"
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder={process.env.COMPANY_EMAIL}
                    />
                  </div>

                  <div>
                    <Label htmlFor="artistRole">Vai trò chính *</Label>
                    <Select value={artistRole} onValueChange={(value: ArtistPrimaryRole) => setArtistRole(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="singer">Ca sĩ</SelectItem>
                        <SelectItem value="singer-songwriter">Singer-Songwriter</SelectItem>
                        <SelectItem value="rapper">Rapper</SelectItem>
                        <SelectItem value="producer">Producer</SelectItem>
                        <SelectItem value="composer">Composer</SelectItem>
                        <SelectItem value="songwriter">Songwriter</SelectItem>
                        <SelectItem value="instrumental">Instrumental</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="songTitle">Tên bài hát *</Label>
                    <Input
                      id="songTitle"
                      value={songTitle}
                      onChange={(e) => setSongTitle(e.target.value)}
                      placeholder="Tên bài hát của bạn"
                    />
                  </div>

                  <div>
                    <Label htmlFor="albumName">Tên album (tùy chọn)</Label>
                    <Input
                      id="albumName"
                      value={albumName}
                      onChange={(e) => setAlbumName(e.target.value)}
                      placeholder="Tên bài hát - Single hoặc Album - EP"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media" className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-6">
                <h3 className="text-xl font-semibold mb-4">Tải lên Media Files</h3>

                {/* Image Upload */}
                <div>
                  <Label htmlFor="imageUpload">Ảnh bìa bài hát (JPG, 4000x4000px, tối đa 10MB) *</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      id="imageUpload"
                      type="file"
                      accept="image/jpeg,image/jpg"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('imageUpload')?.click()}
                      className="mb-4"
                    >
                      <UploadIcon className="mr-2 h-4 w-4" />
                      Chọn bìa ảnh đĩa
                    </Button>
                    {imagePreviewUrl && (
                      <div className="mt-4">
                        <img
                          src={imagePreviewUrl}
                          alt="Xem trước nè"
                          className="mx-auto max-w-xs rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setImageFile(null)
                            setImagePreviewUrl("")
                          }}
                          className="mt-2"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Xóa ảnh
                        </Button>
                      </div>)}
                  </div>
                </div>

                {/* Audio Upload */}
                <div>
                  <Label htmlFor="audioUpload">File nhạc (WAV 24-bit, 2 kênh, 192kHz, tối đa 100MB mỗi file) *</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      id="audioUpload"
                      type="file"
                      accept="audio/wav"
                      multiple
                      onChange={handleAudioUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('audioUpload')?.click()}
                      className="mb-4"
                    >
                      <UploadIcon className="mr-2 h-4 w-4" />
                      Chọn file nhạc
                    </Button>

                    {audioTracks.length > 0 && (
                      <div className="mt-4 space-y-4">
                        {audioTracks.map((track, index) => (
                          <div key={track.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">{track.file.name}</span>
                              <div className="flex items-center gap-2">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleAudioPlayback(track.id, URL.createObjectURL(track.file))}
                                >
                                  {currentlyPlaying === track.id ? (
                                    <Pause className="h-4 w-4" />
                                  ) : (
                                    <Play className="h-4 w-4" />
                                  )}
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeAudioTrack(track.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                          {/* Track title input field */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <Label htmlFor={`track-title-${track.id}`}>Tên bài hát</Label>
                              <Input
                                id={`track-title-${track.id}`}
                                value={track.info.songTitle}
                                onChange={(e) => {
                                  setAudioTracks(prev =>
                                    prev.map(t => {
                                      if (t.id === track.id) {
                                        return {
                                          ...t,
                                          info: {
                                            ...t.info,
                                            songTitle: e.target.value
                                          }
                                        };
                                      }
                                      return t;
                                    })
                                  );
                                }}
                                placeholder="Nhập tên bài hát"
                                className="mt-1"
                              />
                            </div>

                            <div>
                              <Label htmlFor={`track-isrc-${track.id}`}>
                                ISRC (tùy chọn) 
                                <span className="text-sm text-gray-500 ml-1">
                                  - Để trống nếu chưa có, sẽ tự tạo khi release
                                </span>
                              </Label>
                              <Input
                                id={`track-isrc-${track.id}`}
                                value={track.info.isrc}
                                onChange={(e) => updateTrackISRC(track.id, e.target.value)}
                                placeholder="VNA2P25XXXXX hoặc để trống"
                                className="mt-1"
                                maxLength={12}
                              />
                              {track.info.isrc && (
                                <p className="text-xs text-green-600 mt-1">
                                  ✓ ISRC đã có: {track.info.isrc}
                                </p>
                              )}
                              {!track.info.isrc && (
                                <p className="text-xs text-blue-600 mt-1">
                                  📋 Sẽ tự tạo ISRC khi gửi submission
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Additional Artists for this track */}
                          <div className="mt-4">
                            <div className="flex items-center justify-between mb-2">
                              <Label>Nghệ sĩ tham gia ft. (tùy chọn)</Label>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => addAdditionalArtist(track.id)}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Thêm nghệ sĩ
                              </Button>
                            </div>

                            {track.info.additionalArtists.map((artist, artistIndex) => (
                              <div key={artistIndex} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2 p-2 bg-gray-50 rounded">
                                <Input
                                  placeholder="Tên nghệ sĩ"
                                  value={artist.name}
                                  onChange={(e) => updateAdditionalArtist(track.id, artistIndex, 'name', e.target.value)}
                                />
                                <Input
                                  placeholder="Họ tên đầy đủ"
                                  value={artist.fullName || "Theo giấy tờ CCCD"}
                                  onChange={(e) => updateAdditionalArtist(track.id, artistIndex, 'fullName', e.target.value)}
                                />
                                <Select
                                  value={artist.role}
                                  onValueChange={(value: AdditionalArtistRole) => updateAdditionalArtist(track.id, artistIndex, 'role', value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="featuring">Featuring</SelectItem>
                                    <SelectItem value="vocalist">Vocalist</SelectItem>
                                    <SelectItem value="rapper">Rapper</SelectItem>
                                    <SelectItem value="producer">Producer</SelectItem>
                                    <SelectItem value="composer">Composer</SelectItem>
                                    <SelectItem value="songwriter">Songwriter</SelectItem>
                                    <SelectItem value="instrumental">Instrumental</SelectItem>
                                  </SelectContent>
                                </Select>
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="number"
                                    placeholder="% quyền"
                                    min="0"
                                    max="100"
                                    value={artist.percentage}
                                    onChange={(e) => updateAdditionalArtist(track.id, artistIndex, 'percentage', parseInt(e.target.value) || 0)}
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeAdditionalArtist(track.id, artistIndex)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        ))}
                      </div>
                    )}
                                </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metadata" className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-xl font-semibold mb-4">Thông tin metadata</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="mainCategory">Thể loại chính *</Label>
                    <Select value={mainCategory} onValueChange={(value: MainCategory) => setMainCategory(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pop">Pop</SelectItem>
                        <SelectItem value="singer-songwriter">Singer-Songwriter</SelectItem>
                        <SelectItem value="hiphoprap">Hip Hop/Rap</SelectItem>
                        <SelectItem value="edm">EDM</SelectItem>
                        <SelectItem value="rnb">R&B</SelectItem>
                        <SelectItem value="ballad">Ballad</SelectItem>
                        <SelectItem value="acoustic">Acoustic</SelectItem>
                        <SelectItem value="indie">Indie</SelectItem>
                        <SelectItem value="other_main">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="subCategory">Thể loại phụ *</Label>
                    <Select value={subCategory} onValueChange={(value: SubCategory) => setSubCategory(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="official">Official</SelectItem>
                        <SelectItem value="cover">Cover</SelectItem>
                        <SelectItem value="vpop">V-Pop</SelectItem>
                        <SelectItem value="lofi">Lo-fi</SelectItem>
                        <SelectItem value="chill">Chill</SelectItem>
                        <SelectItem value="trap">Trap</SelectItem>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="alternative">Alternative</SelectItem>
                        <SelectItem value="folk">Folk</SelectItem>
                        <SelectItem value="other_sub">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="releaseType">Loại phát hành *</Label>
                    <Select value={releaseType} onValueChange={(value: ReleaseType) => setReleaseType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="ep">EP</SelectItem>
                        <SelectItem value="lp">LP</SelectItem>
                        <SelectItem value="album">Album</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Bạn có sở hữu bản quyền của bài hát này không? *</Label>
                  <RadioGroup
                    value={isCopyrightOwner}
                    onValueChange={(value: CopyrightOwnershipStatus) => setIsCopyrightOwner(value)}
                    className="flex gap-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="copyright-yes" />
                      <Label htmlFor="copyright-yes">Có</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="copyright-no" />
                      <Label htmlFor="copyright-no">Không</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>Bài hát này đã từng được phát hành chưa? *</Label>
                  <RadioGroup
                    value={hasBeenReleased}
                    onValueChange={(value: ReleaseHistoryStatus) => setHasBeenReleased(value)}
                    className="flex gap-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="released-yes" />
                      <Label htmlFor="released-yes">Đã phát hành</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="released-no" />
                      <Label htmlFor="released-no">Chưa phát hành</Label>
                    </div>
                  </RadioGroup>
                </div>

                {hasBeenReleased === "yes" && (
                  <div>
                    <Label>Các nền tảng đã phát hành:</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                      {[
                        { value: "youtube" as Platform, label: "YouTube" },
                        { value: "spotify" as Platform, label: "Spotify" },
                        { value: "apple_music" as Platform, label: "Apple Music" },
                        { value: "soundcloud" as Platform, label: "SoundCloud" },
                        { value: "other_platform" as Platform, label: "Khác" }
                      ].map((platform) => (
                        <div key={platform.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={platform.value}
                            checked={platforms.includes(platform.value)}
                            onCheckedChange={(checked) =>
                              handlePlatformChange(platform.value, checked as boolean)
                            }
                          />
                          <Label htmlFor={platform.value}>{platform.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <Label>Bài hát có lời không? *</Label>
                  <RadioGroup
                    value={hasLyrics}
                    onValueChange={(value: LyricsStatus) => setHasLyrics(value)}
                    className="flex gap-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="lyrics-yes" />
                      <Label htmlFor="lyrics-yes">Có lời</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="lyrics-no" />
                      <Label htmlFor="lyrics-no">Instrumental</Label>
                    </div>
                  </RadioGroup>
                </div>

                {hasLyrics === "yes" && (
                  <div>
                    <Label htmlFor="lyrics">Lời bài hát</Label>
                    <Textarea
                      id="lyrics"
                      value={lyrics}
                      onChange={(e) => setLyrics(e.target.value)}
                      placeholder="Nhập lời bài hát của bạn..."
                      rows={8}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="release" className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-xl font-semibold mb-4">Thông tin phát hành</h3>

                <div>
                  <Label htmlFor="releaseDate">Ngày phát hành mong muốn *</Label>
                  <Input
                    id="releaseDate"
                    type="date"
                    value={releaseDate}
                    onChange={(e) => setReleaseDate(e.target.value)}
                    min={getMinimumReleaseDate()}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Ngày phát hành phải ít nhất 2 ngày kể từ hôm nay hoặc đã từng phát hành thì nhập ngày cũ
                  </p>
                </div>

                <div className="bg-secondary/50 border border-border p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-foreground">📋 Tóm tắt thông tin</h4>
                  <div className="space-y-2 text-sm text-foreground">
                    <p><strong>Nghệ sĩ:</strong> {artistName || "Chưa nhập"}</p>
                    <p><strong>Bài hát:</strong> {songTitle || "Chưa nhập"}</p>
                    <p><strong>Album:</strong> {albumName || "Không có"}</p>
                    <p><strong>Thể loại:</strong> {mainCategory} - {subCategory}</p>
                    <p><strong>Loại phát hành:</strong> {releaseType}</p>
                    <p><strong>Files âm thanh:</strong> {audioTracks.length} file(s)</p>
                    <p><strong>Có ảnh bìa:</strong> {imageFile ? "Có" : "Chưa có"}</p>
                    <p><strong>Ngày phát hành:</strong> {releaseDate || "Chưa chọn"}</p>
                  </div>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={isUploading || !songTitle || !artistName || audioTracks.length === 0}
                  className="w-full"
                  size="lg"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <Rocket className="mr-2 h-4 w-4" />
                      Gửi để tớ duyệt nhanh duyệt lẹ nào
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
