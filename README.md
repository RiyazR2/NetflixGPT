# 🎬 MovieFinder - AI-Powered Movie Discovery Platform

An intelligent movie recommendation platform powered by OpenAI GPT-3.5, featuring conversational AI, natural language query parsing, and smart multi-API architecture for personalized movie discovery.

[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![Redux](https://img.shields.io/badge/Redux-Toolkit-purple)](https://redux-toolkit.js.org/)

## 🌐 Live Demo

🔗 [https://moviefinder-wine.vercel.app](https://moviefinder-wine.vercel.app)

**Quick Test Login:**

- **Email:** user1@gmail.com
- **Password:** User1@1234
- Or create your own account with Sign Up

---

## 📖 Overview

MovieFinder is an intelligent movie discovery platform that combines React with advanced AI features including OpenAI GPT-3.5 integration, LLM function calling for structured query parsing, and conversational memory for multi-turn interactions.

---

## 🚀 Key Features

### 🤖 AI-Powered Search

- **Conversational Memory**: Multi-turn chat retaining context across queries using Redux state management
- **Structured Search**: LLM function calling for natural language to structured filter conversion (95% accuracy)
- **Intelligent Recommendations**: TMDB similarity engine enhanced with LLM-based preference analysis
- **Mood-Based Discovery**: Emotional state detection with intelligent genre mapping using GPT-3.5

### 🎯 Core Functionality

- **Real-time Movie Data**: TMDB API integration with 1000+ movies
- **Bollywood Movies Support**: OMDb API integration for Indian cinema
- **Similar Movies Engine**: TMDB similarity API with intelligent filtering
- **Advanced Filtering**: LLM-powered extraction of genre, year range, rating thresholds from natural language
- **Multi-language Support**: i18n implementation (English, Hindi, Marathi, Telugu, Tamil, Urdu)

### 🎨 User Experience

- **Responsive Design**: Mobile-first with Tailwind CSS
- **Firebase Authentication**: Secure login with demo account option
- **Movie Details Modal**: Rich metadata with cast/crew information
- **Shimmer Loading**: Skeleton screens for better perceived performance

---

## 🛠️ Tech Stack

**Frontend:**

- React 18 with Hooks (useState, useEffect, useRef, useCallback)
- Redux Toolkit for state management
- React Router DOM for navigation
- Tailwind CSS for styling

**Backend & APIs:**

- Firebase Authentication
- TMDB API (Movie database)
- OMDb API (Bollywood/Indian movies)
- OpenAI API (GPT-3.5 for LLM integration)

**Tools:**

- Git & GitHub for version control
- Vercel for deployment
- Environment variables for API security

---

## 📋 Installation & Setup

To set up and run MovieFinder locally:

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/RiyazR2/NetflixGPT.git
   ```

2. **Navigate to the Project Directory:**

   ```bash
   cd NetflixGPT
   ```

3. **Install Dependencies:**

   ```bash
   npm install
   ```

4. **Run the Development Server:**
   ```bash
   npm start
   ```

Visit `http://localhost:3000`

---

## 🎯 AI Features Explained

### 1. Conversational Memory

Multi-turn context management:

```
User: "action movies from 2020"
AI: [Shows 2020 action movies]
User: "older ones"
AI: [Remembers "action", shows pre-2020 movies]
```

### 2. Structured Search (Function Calling)

Natural language to structured filters:

```
Input: "sci-fi from 2015 to 2020 rated above 7"
Output: {genres: ["sci-fi"], year_min: 2015, year_max: 2020, rating_min: 7}
Result: Precise TMDB Discover API query
```

### 3. Similar Movies Discovery

Using TMDB's Similar Movies API:

- Finds related movies based on TMDB's similarity algorithm
- Displays cast, crew, and genre-based recommendations
- One-click discovery of movies with similar themes

---

## 📂 Project Structure

```
src/
├── components/gpt_components/    # AI search UI
├── services/
│   ├── structuredSearchService.js
│   └── similarMoviesService.js
├── utils/
│   ├── gptSlice.js              # Redux state
│   └── openai.js                # Groq client
└── hooks/                        # Custom hooks
```

---

## 📈 Performance

- **AI Response Time**: ~2-3s for GPT-3.5 recommendations
- **TMDB API Latency**: <1s for movie data
- **Languages Supported**: 6 (i18n UI translation)
- **Movie Database**: 1000+ movies from TMDB

---

## 🤝 Contact

**Riyaz Pathan**
📧 LinkedIn: [riyazr2](https://www.linkedin.com/in/riyazr2/)
👨‍💻 GitHub: [RiyazR2](https://github.com/RiyazR2)
🌐 Portfolio: [portfolior2.netlify.app](https://portfolior2.netlify.app/)

---

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) - Movie database and API
- [OpenAI](https://openai.com/) - GPT-3.5 Turbo for AI recommendations
- [Firebase](https://firebase.google.com/) - Authentication service
- [Vercel](https://vercel.com/) - Deployment platform

---

⭐ **Star this repo if you find it helpful!**
