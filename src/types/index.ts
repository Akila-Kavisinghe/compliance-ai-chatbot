
// Base Message Type
export enum MessageType {
    FILE = 'file',
    CHAT = 'chat'
}
export type BaseMessage = {
    id: string
    timestamp: number
    error?: string
    isLoading?: boolean
}

// File Message Types
export enum PIIType {
    EMAIL = 'EMAIL',
    PHONE = 'PHONE',
    SOCIAL_SECURITY = 'SOCIAL_SECURITY',
    CREDIT_CARD = 'CREDIT_CARD',
    NAME = 'NAME'
}
export type PII = {
    value: string,
    type: PIIType,
    page: number,
}
export type FileMessage = BaseMessage & {
    type: MessageType.FILE
    file: File
    pii: PII[]
}

// Chat Messages Types
export enum ChatRole {
    USER = 'user',
    ASSISTANT = 'assistant'
}
export type ChatMessage = BaseMessage & {
    type: MessageType.CHAT
    content: string
    role: ChatRole
}

// Union type for all message types
export type Message = FileMessage | ChatMessage

// Type guard functions
export const isFileMessage = (message: Message): message is FileMessage => {
    return message.type === 'file'
}
export const isChatMessage = (message: Message): message is ChatMessage => {
    return message.type === 'chat'
}
