const mongoose = require("mongoose")

const locationSchema = new mongoose.Schema({
  latitude: {
    type: Number,
    required: true,
    min: -90,
    max: 90,
  },
  longitude: {
    type: Number,
    required: true,
    min: -180,
    max: 180,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  speed: {
    type: Number,
    default: 0,
    min: 0,
  },
})

const vehicleStatsSchema = new mongoose.Schema({
  currentSpeed: {
    type: Number,
    default: 0,
    min: 0,
  },
  distanceCovered: {
    type: Number,
    default: 0,
    min: 0,
  },
  batteryLevel: {
    type: Number,
    default: 100,
    min: 0,
    max: 100,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
})

const vehicleSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: String,
      required: true,
      unique: true,
      default: "VEHICLE_001",
    },
    name: {
      type: String,
      required: true,
      default: "Delivery Truck #1",
    },
    currentLocation: locationSchema,
    locationHistory: [locationSchema],
    stats: vehicleStatsSchema,
    isActive: {
      type: Boolean,
      default: true,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

// Index for better query performance
vehicleSchema.index({ vehicleId: 1 })
vehicleSchema.index({ "currentLocation.timestamp": -1 })
vehicleSchema.index({ "locationHistory.timestamp": -1 })

module.exports = mongoose.model("Vehicle", vehicleSchema)
