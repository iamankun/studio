// This file is auto-generated based on usage in other files.
export interface User {
  UID: string;
  userName: string;
  password?: string;
  email: string;
  userRole?: "Administrator" | "Label Manager" | "Artist" | "Producer" | "Lyricist" | "Composer" | "Singer-Songwriter" | "Vocalist" | "Performer" | "Rapper";
  roles?: string[];
  Name?: string;
  bio?: string;
  socialLinks?: string;
  verified?: boolean;
  createdAt: string;
}
