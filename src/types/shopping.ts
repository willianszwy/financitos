export type Priority = 'Alta' | 'Média' | 'Baixa'

export interface ShoppingItem {
  id: string
  description: string
  estimatedPrice?: number
  priority: Priority
  deadline?: string
  productLink?: string
  purchased: boolean
  purchaseDate?: string
  actualPrice?: number
  createdAt: string
  updatedAt: string
}

export interface ShoppingList {
  items: ShoppingItem[]
  lastUpdated: string
}

export interface PriorityColors {
  Alta: string
  Média: string
  Baixa: string
}

export const PRIORITY_COLORS: PriorityColors = {
  Alta: '#a85959',
  Média: '#ddb56f',
  Baixa: '#5c85c7'
}

export const PRIORITY_EMOJIS = {
  Alta: '🔴',
  Média: '🟡',
  Baixa: '🔵'
}