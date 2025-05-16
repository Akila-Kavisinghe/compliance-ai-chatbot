'use client'

import React from 'react';
import { Loader2, User, Bot, FileText } from 'lucide-react';
import { useMessage } from '@/context/MessageContext';
import { ChatMessage, isChatMessage, ChatRole, isFileMessage, FileMessage, PII } from '@/types';

const FileMessageView = ({ message }: { message: FileMessage }) => {
    return (
      <div className="flex justify-start mb-4">
        <div className="flex items-start space-x-2 max-w-[80%] flex-row">
          <div className="flex-shrink-0 mr-2">
            <Bot size={24} className="text-gray-600" />
          </div>
          <div className="bg-gray-100 text-gray-900 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <FileText size={20} className="text-gray-500" />
              <a
                href={URL.createObjectURL(message.file)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                {message.file.name}
              </a>
            </div>
            {message.isLoading ? (
              <div className="flex items-center text-gray-500">
                <Loader2 className="animate-spin mr-2" size={16} />
                <span>Analyzing file...</span>
              </div>
            ) : message.error ? (
              <div className="text-red-600 text-sm">{message.error}</div>
            ) : (
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">
                  Found {message.pii.length} PIIs
                </h3>
                {message.pii.length > 0 && (
                  <div className="border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {message.pii.map((pii: PII, index: number) => (
                          <tr key={index}>
                            <td className="px-4 py-2 text-sm text-gray-900">{pii.type}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">{pii.value}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">{pii.page}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

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
            Start a conversation or drag and drop a file for instant analysis
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
          {isFileMessage(message) ? (
            <FileMessageView message={message} />
          ) : isChatMessage(message) ? (
            <ChatMessageView message={message} />
          ) : null}
        </div>
        ))}
      </div>
    </div>
  );
}
