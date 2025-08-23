export * from './financial'
export * from './shopping'

export interface GoogleDriveFile {
  id: string
  name: string
  parents?: string[]
  mimeType: string
  modifiedTime: string
  size?: string
}

export interface NotificationData {
  title: string
  body: string
  icon?: string
  badge?: string
  tag?: string
  data?: any
}

export interface AppSettings {
  googleDriveEnabled: boolean
  notificationsEnabled: boolean
  notificationTime: string // HH:MM format
  lastSync?: string
  autoSync: boolean
}