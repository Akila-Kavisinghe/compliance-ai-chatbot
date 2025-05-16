// Base message type
export type BaseMessage = {
    id: string
    timestamp: number
    error?: string
    isLoading?: boolean
  }
  
  export enum MessageType {
    FILE = 'file',
    CHAT = 'chat'
  }
  
  export enum ChatRole {
      USER = 'user',
      ASSISTANT = 'assistant'
  }
  
  // Chat message type
  export type ChatMessage = BaseMessage & {
    type: MessageType.CHAT
    content: string
    role: ChatRole
  }
  
  // Union type for all message types
  export type Message = ChatMessage
  
  export const isChatMessage = (message: Message): message is ChatMessage => {
    return message.type === 'chat'
  }
  