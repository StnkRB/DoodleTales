# 🎨 DoodleTales: The Magical Storytelling Scout

DoodleTales is an AI-powered interactive storytelling application that brings children's drawings to life. By combining advanced computer vision, real-time multimodal AI, and style-consistent image generation, DoodleTales turns a simple sketch into a living, breathing adventure.

**Built for the Google Gemini Hackathon.**

## 🌟 Key Features

- **Character Recognition (Vision)**: Automatically identifies and segments characters and objects from a child's drawing using high-precision bounding boxes.
- **Multimodal Live Chat**: Talk directly to the "Storytelling Scout" using your voice. The scout learns about your characters (names, ages, roles) in real-time.
- **Style-Consistent Image Generation**: Generates new scenes for the story while strictly maintaining the original drawing style, colors, and character designs.
- **Interactive Canvas**: Characters "come to life" with magical halos and animations when the AI refers to them.

## 🛠️ Tech Stack

- **Frontend**: React 19, Tailwind CSS 4, Motion (Framer Motion), Lucide Icons.
- **Backend**: Node.js, Express.
- **AI (Google)**: 
  - `gemini-3-flash-preview` (Vision & Reasoning)
  - `gemini-2.5-flash-native-audio-preview` (Live Multimodal Chat)
  - `gemini-2.5-flash-image` (Style-consistent Image Gen)
- **Infrastructure**: Docker, Google Cloud Run.

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 20+
- A Google AI Studio API Key

### 2. Installation
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file (or set in your environment):
```env
GEMINI_API_KEY=your_google_key
```

### 4. Run Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

## 📦 Deployment

### Cloud Run (Recommended)
```bash
gcloud run deploy doodletales --source . --region europe-west2 --allow-unauthenticated
```

## 📜 License
MIT
