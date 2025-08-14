export interface User {
  id: string
  email: string
  name?: string
  password?: string
  roles: UserRole[]
  fullName?: string
  createdAt: string
  avatar?: string
  bio?: string
  socialLinks?: {
    facebook?: string
    youtube?: string
    spotify?: string
    appleMusic?: string
    tiktok?: string
    instagram?: string
  }
  verified?: boolean // Trạng thái xác minh từ profile
  isrcCodePrefix?: string
}

// Enum UserRole đúng chuẩn schema
export type UserRole =
  | "ARTIST"
  | "COMPOSER"
  | "PRODUCER"
  | "PERFORMER"
  | "LABEL_MANAGER"
  | "ADMINISTRATOR";

// Legacy compatibility - these interfaces are deprecated
// ...existing code...
