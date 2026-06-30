# maz-chatbot

A personal AI chatbot that lets you chat with OpenAI (GPT) or a local Ollama model, with per-session memory and Markdown-rendered responses.

## Features

- Switch between **OpenAI GPT** and a local **Ollama** model (Gemma 3)
- Per-session conversation history
- Markdown-rendered responses
- Clean, modern chat UI built with shadcn/ui

## Tech Stack

### Frontend

- React 19, TypeScript
- Vite, Tailwind CSS v4, shadcn/ui (Radix UI)
- react-markdown, Axios

### Backend

- Bun runtime, Express 5
- OpenAI SDK, Ollama SDK
- Zod for request validation

### Monorepo

Two packages — `packages/client` and `packages/server` — orchestrated from the root with `concurrently`.
