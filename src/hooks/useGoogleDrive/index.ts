import { useState, useCallback, useEffect } from 'react'
import GoogleDriveService, { UploadResult } from '@/services/googleDrive'
import { StorageService } from '@/services/storage'

export interface GoogleDriveState {
  isAuthenticated: boolean
  user?: {
    name: string
    email: string
  }
  isLoading: boolean
  error: string | null
  lastSync?: string
}

export const useGoogleDrive = () => {
  const [state, setState] = useState<GoogleDriveState>({
    isAuthenticated: false,
    isLoading: false,
    error: null
  })

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const auth = await GoogleDriveService.getAuthStatus()
      setState(prev => ({
        ...prev,
        isAuthenticated: auth.isSignedIn,
        user: auth.user,
        isLoading: false
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to check auth status'
      }))
    }
  }, [])

  const signIn = useCallback(async (): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const auth = await GoogleDriveService.signIn()
      setState(prev => ({
        ...prev,
        isAuthenticated: auth.isSignedIn,
        user: auth.user,
        isLoading: false,
        error: auth.isSignedIn ? null : 'Sign in failed'
      }))
      
      return auth.isSignedIn
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        isAuthenticated: false,
        error: error instanceof Error ? error.message : 'Sign in failed'
      }))
      return false
    }
  }, [])

  const signOut = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true }))
    
    try {
      await GoogleDriveService.signOut()
      setState(prev => ({
        ...prev,
        isAuthenticated: false,
        user: undefined,
        isLoading: false,
        error: null
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Sign out failed'
      }))
    }
  }, [])

  const syncData = useCallback(async (): Promise<boolean> => {
    if (!state.isAuthenticated) {
      setState(prev => ({ ...prev, error: 'Not authenticated with Google Drive' }))
      return false
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      // Export all data from localStorage
      const allData = StorageService.exportAllData()
      
      if (!allData) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'No data to sync'
        }))
        return false
      }

      // Upload to Google Drive
      const result: UploadResult = await GoogleDriveService.syncAllData(allData)
      
      if (result.success) {
        const now = new Date().toISOString()
        setState(prev => ({
          ...prev,
          isLoading: false,
          lastSync: now,
          error: null
        }))

        // Update app settings with last sync time
        const settings = StorageService.getAppSettings()
        StorageService.saveAppSettings({
          ...settings,
          lastSync: now
        })

        return true
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: result.error || 'Sync failed'
        }))
        return false
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Sync failed'
      }))
      return false
    }
  }, [state.isAuthenticated])

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  return {
    ...state,
    signIn,
    signOut,
    syncData,
    checkAuthStatus,
    clearError
  }
}