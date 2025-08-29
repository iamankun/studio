export interface User {
  UID: string
  userName: string
  email: string
  fullName?: string
  password: string
  roles: UserRole[]
  createdAt: Date
  updatedAt: Date
}

export enum UserRole {
  COMPOSER = "COMPOSER",
  PRODUCER = "PRODUCER", 
  PERFORMER = "PERFORMER",
  LABEL_MANAGER = "LABEL_MANAGER",
  ADMINISTRATOR = "ADMINISTRATOR"
}