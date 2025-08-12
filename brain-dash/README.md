# 🧠⚡ Brain Dash - Energy-Aware Task Manager

An intelligent task manager that takes your brain dump and categorizes tasks based on urgency and energy requirements. Perfect for busy professionals and individuals with ADHD.

## Features

- 🎤 **Voice Input**: Speak your tasks instead of typing
- 🤖 **AI Parsing**: Google Gemini automatically categorizes tasks
- ⚡ **Energy Matching**: Highlights tasks matching your current energy level
- 🎯 **4-Quadrant System**: 
  - 🔥 Do It Now (Urgent & High Energy)
  - ⚡ Focus (Urgent & Low Energy) 
  - 🚀 Productive Procrastination (Not Urgent & High Energy)
  - ✅ Easy Wins (Not Urgent & Low Energy)
- 🎨 **Dopamine-Friendly Design**: Minimalist, calm, and encouraging
- 🔐 **Secure**: Simple username/password auth with encrypted storage
- ☁️ **Cloud Sync**: Access your tasks from any device

## Quick Start

### 1. Setup Environment Variables

Create a `.env.local` file in the root directory:

```bash
VITE_GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=your_jwt_secret_here_make_it_long_and_random
```

### 2. Get Your Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env.local` file

### 3. Install & Run Locally

```bash
npm install
npm run dev
```

The app will open at `http://localhost:5173`

## Deployment to Vercel

### 1. Install Vercel CLI

```bash
npm i -g vercel
```

### 2. Deploy

```bash
vercel
```

### 3. Set Environment Variables

In your Vercel dashboard:
- Add `GEMINI_API_KEY` with your Google Gemini API key
- Add `JWT_SECRET` with a long random string

## How to Use

1. **Sign Up**: Create an account with username/password
2. **Select Energy** (optional): Choose your current energy level
3. **Brain Dump**: Type or speak all your tasks naturally
4. **Get Organized**: Click "Organize My Brain" to see categorized tasks
5. **Take Action**: Focus on tasks that match your energy level

## Example Brain Dump

```
I need to finish the TPS report for Friday it's super important, also the car needs an oil change sometime, reply to Sarah's important email, organize my desktop files when I have time, and I should probably call mom back this week
```

## Tech Stack

- **Frontend**: React + Vite
- **Styling**: Custom CSS with CSS variables
- **AI**: Google Gemini 1.5 Flash
- **Auth**: JWT with bcryptjs
- **Database**: SQLite with better-sqlite3
- **Deployment**: Vercel
- **Voice**: Web Speech API

## Browser Support

- ✅ Chrome (full features including voice)
- ✅ Safari (full features including voice)  
- ✅ Firefox (text input only - no voice support)
- ✅ Edge (full features including voice)

## Contributing

This is a focused productivity app built for simplicity and effectiveness. If you have suggestions for improvements that align with the core mission of helping people organize their thoughts without overwhelm, please open an issue.

## License

MIT License - feel free to use this code for your own productivity needs!

---

Built with ❤️ to help people get their thoughts organized and take action that matches their energy.
