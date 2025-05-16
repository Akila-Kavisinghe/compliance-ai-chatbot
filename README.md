# Setup

In the root directory, run the following command to set up the project:

## Install dependencies
```bash
npm install
```

## Environment Variables

Create a `.env` file in the root directory with the following:
```
GOOGLE_GENERATIVE_AI_API_KEY=your_google_generative_ai_api_key
```

You can retrieve your Google Generative AI API key from the [Google Cloud Console](https://console.cloud.google.com).

## Run the development server
```bash
npm run dev
```

## Opening the app

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# Architecture

## Overview

The application is built with Next.js App Router and Next.js API Routes.

it uses the following technologies:
- Next.js (Frontend)
- Next.js API Routes (Backend)
- Tailwind CSS (Styling)
- Lucide Icons (Icons)
- Verecel AI SDK (AI SDK)
- Google Generative AI API (LLM) (Note: I would like to test different LLMs, but the Google Generative AI API has a generous free tier)

# Implemented Tool Functions
## PII Detection

Used the vercel ai sdk to implement PII detection. The API Route is implemented as a Next.js serverless function. It accepts a file (PDF or image) upload and returns a list of PIIs detected in the file.

interpretFile.ts is the main service function that implements the PII detection. It uses the `generateText` function to interact with the model. The LLM is configured to use the `validatePII` tool to validate the PIIs detected in the file which utilizes general regex patterns to validate various PIIs. This regex validation acts like a filter to remove LLM false positives.

## Design decisions

### React Context API

Used the React Context API to store the messages in the chat. Every conversation would be stored in this context. Any context is passed to the LLM via the client to allow the backend to be stateless.

### Chat System

Instead of opting for the useChat hook provided by the vercel ai sdk, I opted to implement my own hook to have more flexibility on the message format.

###  Next.js API Routes

Used Next.js API Routes since they are a great way to implement serverless functions in Next.js.

# Future Improvements

## Chat History - Add a chat history to the app

## LLM Text Streaming - Stream the LLM response to the user

## PII Detection - Iterate on detection prompts and test other LLMs for best fit.

## Chat Storage - Store chat history in a database

