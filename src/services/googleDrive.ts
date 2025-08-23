// Google Drive API integration for Financitos
// This service handles OAuth2 authentication and file operations with Google Drive

export interface GoogleDriveConfig {
  clientId: string
  apiKey: string
  discoveryDoc: string
  scopes: string
}

export interface GoogleDriveAuth {
  isSignedIn: boolean
  user?: {
    name: string
    email: string
  }
}

export interface UploadResult {
  success: boolean
  fileId?: string
  error?: string
}

export class GoogleDriveService {
  private static instance: GoogleDriveService
  private gapi: any = null
  private isInitialized = false
  
  private config: GoogleDriveConfig = {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
    apiKey: import.meta.env.VITE_GOOGLE_API_KEY || '',
    discoveryDoc: 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
    scopes: 'https://www.googleapis.com/auth/drive.file'
  }

  private constructor() {}

  static getInstance(): GoogleDriveService {
    if (!GoogleDriveService.instance) {
      GoogleDriveService.instance = new GoogleDriveService()
    }
    return GoogleDriveService.instance
  }

  async initialize(): Promise<boolean> {
    try {
      if (this.isInitialized) return true

      // Load Google API script if not already loaded
      if (!window.gapi) {
        await this.loadGoogleAPI()
      }

      this.gapi = window.gapi
      await this.gapi.load('auth2:client', async () => {
        await this.gapi.client.init({
          apiKey: this.config.apiKey,
          clientId: this.config.clientId,
          discoveryDocs: [this.config.discoveryDoc],
          scope: this.config.scopes
        })
      })

      this.isInitialized = true
      return true
    } catch (error) {
      console.error('Failed to initialize Google Drive API:', error)
      return false
    }
  }

  private loadGoogleAPI(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://apis.google.com/js/api.js'
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Failed to load Google API script'))
      document.head.appendChild(script)
    })
  }

  async signIn(): Promise<GoogleDriveAuth> {
    try {
      if (!this.isInitialized) {
        await this.initialize()
      }

      const authInstance = this.gapi.auth2.getAuthInstance()
      const user = await authInstance.signIn()
      
      return {
        isSignedIn: true,
        user: {
          name: user.getBasicProfile().getName(),
          email: user.getBasicProfile().getEmail()
        }
      }
    } catch (error) {
      console.error('Sign in failed:', error)
      return { isSignedIn: false }
    }
  }

  async signOut(): Promise<void> {
    try {
      const authInstance = this.gapi.auth2.getAuthInstance()
      await authInstance.signOut()
    } catch (error) {
      console.error('Sign out failed:', error)
    }
  }

  async getAuthStatus(): Promise<GoogleDriveAuth> {
    try {
      if (!this.isInitialized) {
        await this.initialize()
      }

      const authInstance = this.gapi.auth2.getAuthInstance()
      const isSignedIn = authInstance.isSignedIn.get()
      
      if (isSignedIn) {
        const user = authInstance.currentUser.get()
        return {
          isSignedIn: true,
          user: {
            name: user.getBasicProfile().getName(),
            email: user.getBasicProfile().getEmail()
          }
        }
      }
      
      return { isSignedIn: false }
    } catch (error) {
      console.error('Failed to get auth status:', error)
      return { isSignedIn: false }
    }
  }

  async createFolder(name: string, parentFolderId?: string): Promise<string | null> {
    try {
      const metadata = {
        name: name,
        mimeType: 'application/vnd.google-apps.folder',
        parents: parentFolderId ? [parentFolderId] : undefined
      }

      const response = await this.gapi.client.drive.files.create({
        resource: metadata
      })

      return response.result.id
    } catch (error) {
      console.error('Failed to create folder:', error)
      return null
    }
  }

  async findFolder(name: string, parentFolderId?: string): Promise<string | null> {
    try {
      const query = parentFolderId 
        ? `name='${name}' and parents in '${parentFolderId}' and mimeType='application/vnd.google-apps.folder' and trashed=false`
        : `name='${name}' and mimeType='application/vnd.google-apps.folder' and trashed=false`

      const response = await this.gapi.client.drive.files.list({
        q: query,
        spaces: 'drive'
      })

      const folders = response.result.files
      return folders && folders.length > 0 ? folders[0].id : null
    } catch (error) {
      console.error('Failed to find folder:', error)
      return null
    }
  }

  async ensureFolderStructure(): Promise<{ dataFolderId: string | null, receiptsFolderId: string | null }> {
    try {
      // Find or create main Financitos folder
      let mainFolderId = await this.findFolder('Financitos')
      if (!mainFolderId) {
        mainFolderId = await this.createFolder('Financitos')
      }

      if (!mainFolderId) {
        return { dataFolderId: null, receiptsFolderId: null }
      }

      // Find or create 'dados' folder
      let dataFolderId = await this.findFolder('dados', mainFolderId)
      if (!dataFolderId) {
        dataFolderId = await this.createFolder('dados', mainFolderId)
      }

      // Find or create 'comprovantes' folder
      let receiptsFolderId = await this.findFolder('comprovantes', mainFolderId)
      if (!receiptsFolderId) {
        receiptsFolderId = await this.createFolder('comprovantes', mainFolderId)
      }

      return { dataFolderId, receiptsFolderId }
    } catch (error) {
      console.error('Failed to ensure folder structure:', error)
      return { dataFolderId: null, receiptsFolderId: null }
    }
  }

  async uploadFile(content: string, fileName: string, folderId: string): Promise<UploadResult> {
    try {
      const metadata = {
        name: fileName,
        parents: [folderId]
      }

      // Check if file already exists and update instead of creating new
      const existingFile = await this.findFile(fileName, folderId)
      
      let response
      if (existingFile) {
        response = await this.gapi.client.request({
          path: `https://www.googleapis.com/upload/drive/v3/files/${existingFile}`,
          method: 'PATCH',
          params: {
            uploadType: 'media'
          },
          headers: {
            'Content-Type': 'application/json'
          },
          body: content
        })
      } else {
        const form = new FormData()
        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }))
        form.append('file', new Blob([content], { type: 'application/json' }))

        response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token}`
          },
          body: form
        })
      }

      return {
        success: true,
        fileId: existingFile || (await response.json()).id
      }
    } catch (error) {
      console.error('Failed to upload file:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      }
    }
  }

  private async findFile(fileName: string, folderId: string): Promise<string | null> {
    try {
      const response = await this.gapi.client.drive.files.list({
        q: `name='${fileName}' and parents in '${folderId}' and trashed=false`,
        spaces: 'drive'
      })

      const files = response.result.files
      return files && files.length > 0 ? files[0].id : null
    } catch (error) {
      console.error('Failed to find file:', error)
      return null
    }
  }

  async downloadFile(fileId: string): Promise<string | null> {
    try {
      const response = await this.gapi.client.drive.files.get({
        fileId: fileId,
        alt: 'media'
      })

      return response.body
    } catch (error) {
      console.error('Failed to download file:', error)
      return null
    }
  }

  async syncAllData(allData: string): Promise<UploadResult> {
    try {
      const { dataFolderId } = await this.ensureFolderStructure()
      
      if (!dataFolderId) {
        return {
          success: false,
          error: 'Failed to create folder structure'
        }
      }

      const fileName = `backup_${new Date().toISOString().split('T')[0]}.json`
      return await this.uploadFile(allData, fileName, dataFolderId)
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Sync failed'
      }
    }
  }
}

// Global type declaration for Google API
declare global {
  interface Window {
    gapi: any
  }
}

export default GoogleDriveService.getInstance()