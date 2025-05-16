'use client'

import React from 'react';
import { Loader2, User, Bot } from 'lucide-react';
import { useMessage } from '@/context/MessageContext';
import { ChatMessage, isChatMessage, ChatRole } from '@/types';

const ChatMessageView = ({ message }: { message: ChatMessage }) => {
  const isUser = message.role === ChatRole.USER
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex items-start space-x-2 max-w-[80%] ${isUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
        <div className={`flex-shrink-0 ${isUser ? 'ml-2' : 'mr-2'}`}>
          {isUser ? (
            <User size={24} className="text-indigo-600" />
          ) : (
            <Bot size={24} className="text-gray-600" />
          )}
        </div>
        <div className={`rounded-lg p-3 ${
          isUser 
            ? 'bg-indigo-600 text-white' 
            : 'bg-gray-100 text-gray-900'
        }`}>
          {!isUser && message.isLoading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="animate-spin" size={16} />
              <span>Thinking...</span>
            </div>
          ) : message.error ? (
            <div className="text-red-400">{message.error}</div>
          ) : (
            <p className="text-sm">{message.content}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export const MessageList = () => {
  const { messages } = useMessage();

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">PII AI Detector Bot</h2>
          <p className="text-gray-600">
            Start a conversation or drag and drop a file to for instant analysis
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {messages.map((message) => (
          <div key={message.id}>
            {isChatMessage(message) ? (
              <ChatMessageView message={message} />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
