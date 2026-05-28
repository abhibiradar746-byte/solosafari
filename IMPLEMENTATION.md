# SoloSafiri India - Real-time Travel Safety App

A real-time solo travel application for India with GPS tracking, Google Maps integration, and safety features.

## API Keys Required

Update `.env` in the backend folder with your API keys:

```env
GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY_HERE
TWILIO_ACCOUNT_SID=YOUR_TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN=YOUR_TWILIO_AUTH_TOKEN
TWILIO_PHONE_NUMBER=+1234567890
OPENAI_API_KEY=YOUR_OPENAI_API_KEY_HERE
```

## Features Implemented

- **Real-time GPS**: Browser Geolocation API + Socket.IO for live location tracking
- **Google Maps Integration**: Real-time route calculation via Google Directions API
- **Twilio SMS**: Real emergency alerts to saved contacts
- **OpenAI Chatbot**: AI-powered travel assistant (Sahayrak) for route/safety recommendations
- **Socket.IO**: Real-time communication between clients and server

## Running the App

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend - Open frontend/index.html in a browser
```

## Architecture

- **Backend**: Express + Socket.IO + TypeScript
- **Frontend**: Vanilla JS with Leaflet.js maps
- **Real-time**: Socket.IO for GPS updates and SOS alerts
- **SMS**: Twilio for emergency notifications (when configured)