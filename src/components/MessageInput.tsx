'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Send, Paperclip } from 'lucide-react'
import { useMessage } from '@/context/MessageContext'
import { ChatRole, MessageType } from '@/types'

export const MessageInput = () => {
    const [input, setInput] = useState('')
    const { addMessage, isLoading } = useMessage()
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [error, setError] = useState<string | null>(null)
    const [isDragging, setIsDragging] = useState(false)

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
            textareaRef.current.style.height = `${Math.min(
                textareaRef.current.scrollHeight,
                160
            )}px`
        }
    }, [input])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (input.trim() && !isLoading) {
            addMessage({
                id: crypto.randomUUID(),
                type: MessageType.CHAT,
                content: input,
                role: ChatRole.USER,
                timestamp: Date.now(),
            })
            setInput('')

            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto'
            }
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
        }
    }

    const handleFileUpload = (file: File) => {
        if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
            setError('Only images and PDFs are supported.')
            return
        }
        setError(null)
        addMessage({
            id: crypto.randomUUID(),
            type: MessageType.FILE,
            file,
            timestamp: Date.now(),
            pii: [],
        })
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        if (isLoading) return
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files[0]
        if (file) handleFileUpload(file)
    }

    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        if (isLoading) return
        e.preventDefault()
        setIsDragging(true)
    }

    const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        if (isLoading) return
        e.preventDefault()
        setIsDragging(false)
    }

    return (
        <div className="sticky bottom-0 p-6 bg-white border-t border-gray-200">
            <div className="max-w-4xl mx-auto">
                <div
                    className={`relative ${isDragging ? 'border-indigo-500 bg-indigo-50' : ''}`}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                >
                    <form onSubmit={handleSubmit} className="relative">
                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a message or drag & drop a file..."
                            rows={1}
                            disabled={isLoading}
                            className="block w-full resize-none border-0 bg-transparent py-3 px-4 pr-24 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 disabled:opacity-50 rounded-xl border border-gray-200 shadow-sm focus:border-indigo-500 focus:outline-none transition-all duration-200"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*,.pdf"
                                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isLoading}
                                className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-full"
                            >
                                <Paperclip size={18} />
                            </button>
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className={`rounded-full p-2 ${input.trim() && !isLoading
                                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                        : 'bg-gray-200 text-gray-400'
                                    } transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </form>
                    {error && <p className="mt-2 text-sm text-red-600 text-center">{error}</p>}
                </div>
                <p className="mt-2 text-xs text-center text-gray-500">
                    Upload an image or PDF to scan, or type a message
                </p>
            </div>
        </div>
    )
}
