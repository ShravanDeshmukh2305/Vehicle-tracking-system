# Vehicle Tracker App

A real-time vehicle tracking system built with React.js (Vite) and Express.js.

## Features

- Real-time vehicle movement on map
- Historical route visualization
- MongoDB integration
- MVC architecture backend
- Responsive design

## Installation

1. Install all dependencies:
\`\`\`bash
npm run install-all
\`\`\`

2. Start MongoDB service on your machine

3. Run the application:
\`\`\`bash
npm run dev
\`\`\`

## Tech Stack

- **Frontend**: React.js, Vite, Leaflet, SCSS, Axios
- **Backend**: Express.js, MongoDB, Mongoose
- **Architecture**: MVC Pattern

## API Endpoints

- GET /api/vehicles/current - Get current vehicle location
- GET /api/vehicles/history - Get vehicle location history
- GET /api/vehicles/route - Get complete route data

## Project Structure

\`\`\`
vehicle-tracker-app/
├── client/                 # React Frontend
├── server/                 # Express Backend
├── .env                   # Environment variables
└── README.md
\`\`\`
