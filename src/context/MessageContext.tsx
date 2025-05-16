'use client'

import React, { createContext, useState, useContext } from 'react';
import { Message, isChatMessage, ChatRole, MessageType, isFileMessage, PII, PIIType, ChatMessage } from '@/types';

export type MessageContextType = {
    messages: Message[];
    addMessage: (message: Message) => void;
    clearMessages: () => void;
    isLoading: boolean;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

type MessageProviderProps = {
    children: React.ReactNode;
};

export const MessageProvider = ({ children }: MessageProviderProps) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const addMessage = (message: Message) => {
        if (isFileMessage(message)) {
            const userID = crypto.randomUUID()
            const assistantID = message.id
            setMessages(prev => [
                ...prev,
                {
                    id: userID,
                    type: MessageType.CHAT,
                    content: `Uploaded: ${message.file.name}`,
                    role: ChatRole.USER,
                    timestamp: Date.now()
                },
                { ...message, isLoading: true }
            ])
            interpretFile(userID, assistantID, message.file)
        } else if (isChatMessage(message)) {
            const assistantID = crypto.randomUUID()
            setMessages(prev => [
                ...prev,
                { ...message, isLoading: true }
            ])
            interpretChat(assistantID, message.content)
        }
    }

    const interpretFile = async (userID: string, assistantID: string, file: File) => {
        try {
            setIsLoading(true)
            // TODO: Replace with API call
            await new Promise(resolve => setTimeout(resolve, 5000));
            const result: PII[] = [{ value: 'test@test.com', type: PIIType.EMAIL, page: 1 }, { value: '1234567890', type: PIIType.PHONE, page: 1 }]
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === assistantID
                        ? { ...msg, pii: result ?? [], isLoading: false }
                        : msg
                )
            )
        } catch (error) {
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === userID
                        ? { ...msg, error: `An error has occurred: ${(error as Error).message}`, isLoading: false }
                        : msg
                )
            )
        } finally {
            setIsLoading(false)
        }
    }

    const interpretChat = async (assistantID: string, content: string) => {
        try {
            setIsLoading(true)
            // Add initial assistant message with loading state
            const assistantMessage: ChatMessage = {
                id: assistantID,
                type: MessageType.CHAT,
                content: "Thinking...",
                role: ChatRole.ASSISTANT,
                timestamp: Date.now(),
                isLoading: true
            }
            setMessages(prev => [...prev, assistantMessage])

            // TODO: Replace with API call
            await new Promise(resolve => setTimeout(resolve, 5000));
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === assistantMessage.id
                        ? {
                            ...msg,
                            content: `This is a test response. Here is your content: ${content}`,
                            isLoading: false
                        }
                        : msg
                )
            )
        } catch (error) {
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === assistantID
                        ? { ...msg, error: `An error has occurred: ${(error as Error).message}`, isLoading: false }
                        : msg
                )
            )
        } finally {
            setIsLoading(false)
        }
    }

    const clearMessages = () => {
        setMessages([]);
    };

    return (
        <MessageContext.Provider value={{ messages, addMessage, clearMessages, isLoading }}>
            {children}
        </MessageContext.Provider>
    );
};

export const useMessage = (): MessageContextType => {
    const context = useContext(MessageContext);
    if (context === undefined) {
        throw new Error('useMessage must be used within a MessageProvider');
    }
    return context;
};