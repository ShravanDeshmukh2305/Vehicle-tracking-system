const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")
require("dotenv").config()

const vehicleRoutes = require("./routes/vehicleRoutes")

const app = express()

app.use(helmet())
app.use(cors())
app.use(morgan("combined"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/vehicles", vehicleRoutes)

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Vehicle Tracker API with OpenStreetMap is running",
    timestamp: new Date().toISOString(),
    features: [
      "Real-time tracking",
      "OpenStreetMap integration (Free)",
      "Route playback with controls",
      "Historical data (7 days)",
      "Vehicle statistics",
      "No API keys required",
    ],
    mapProvider: "OpenStreetMap",
    cost: "100% Free",
  })
})

app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  })
})

module.exports = app
