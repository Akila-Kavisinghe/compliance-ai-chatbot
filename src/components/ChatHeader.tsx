'use client'

import React from 'react';
import { useMessage } from '@/context/MessageContext';

export const ChatHeader = () => {
  const { clearMessages } = useMessage();

  return (
    <>
      <header className="fixed z-50 w-full top-0 bg-white border-b border-gray-200 py-4 px-4 sm:px-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">Personally Identifiable Information (PII) AI Detector</h1>
        <button
          onClick={clearMessages}
          className="text-sm text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 px-3 py-1 rounded-md"
        >
          Clear History
        </button>
      </header>
      <div className="pt-16"/>
    </>
  );
};
