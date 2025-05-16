'use client'

import React, { createContext, useState, useContext } from 'react';
import { Message, isChatMessage, ChatRole, MessageType } from '@/types';

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
        if (isChatMessage(message) && message.role === ChatRole.USER) {
            const assistantMessage: Message = {
                id: crypto.randomUUID(),
                type: MessageType.CHAT,
                content: 'Hello',
                role: ChatRole.ASSISTANT,
                timestamp: Date.now()
            }
            setMessages(prev => [
                ...prev,
                { ...message, isLoading: true },
                assistantMessage
            ])
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