const Vehicle = require("../models/Vehicle");
const dummyLocations = require("../data/dummyLocations.json");
const { format, startOfDay, endOfDay, subDays } = require("date-fns");

class VehicleService {
  constructor() {
    this.currentLocationIndex = 0;
    this.simulationInterval = null;
    this.startLocationSimulation();
  }

  async initializeDummyData() {
    try {
      const existingVehicle = await Vehicle.findOne({ vehicleId: "VEHICLE_001" });

      if (!existingVehicle) {
        const initialLocation = {
          ...dummyLocations[0],
          speed: Math.floor(Math.random() * 60) + 20,
        };

        const vehicle = new Vehicle({
          vehicleId: "VEHICLE_001",
          name: "Delivery Truck #1",
          currentLocation: initialLocation,
          locationHistory: [initialLocation],
          stats: {
            currentSpeed: initialLocation.speed,
            distanceCovered: 0,
            batteryLevel: 85,
            lastUpdated: new Date(),
          },
          isActive: true,
        });

        await vehicle.save();
        await this.generateHistoricalData();
        console.log("✅ Dummy vehicle data initialized with historical routes");
      } else {
        console.log("✅ Vehicle data already exists");
      }
    } catch (error) {
      console.error("❌ Error initializing dummy data:", error);
    }
  }

  async generateHistoricalData() {
    try {
      const vehicle = await Vehicle.findOne({ vehicleId: "VEHICLE_001" });
      if (!vehicle) return;

      for (let i = 1; i <= 7; i++) {
        const date = subDays(new Date(), i);
        const dayStart = startOfDay(date);
        const dayRoute = this.generateDayRoute(dayStart, i);
        vehicle.locationHistory.push(...dayRoute);
      }

      await vehicle.save();
      console.log("✅ Historical route data generated for last 7 days");
    } catch (error) {
      console.error("❌ Error generating historical data:", error);
    }
  }

  generateDayRoute(startDate, dayOffset) {
    const route = [];
    const baseLatitude = 17.385044 + dayOffset * 0.001;
    const baseLongitude = 78.486671 + dayOffset * 0.001;
    const pointCount = Math.floor(Math.random() * 10) + 20;

    for (let i = 0; i < pointCount; i++) {
      const timestamp = new Date(startDate.getTime() + i * 30 * 60 * 1000);
      const latitude = baseLatitude + (Math.random() * 0.01 - 0.005);
      const longitude = baseLongitude + (Math.random() * 0.01 - 0.005);
      const speed = Math.floor(Math.random() * 60) + 20;

      route.push({ latitude, longitude, timestamp, speed });
    }

    return route;
  }

  startLocationSimulation() {
    this.simulationInterval = setInterval(async () => {
      try {
        await this.simulateMovement();
      } catch (error) {
        console.error("Error in location simulation:", error);
      }
    }, 5000);

    console.log("🚗 Vehicle location simulation started");
  }
async simulateMovement() {
  try {
    if (this.currentLocationIndex >= dummyLocations.length) {
      this.currentLocationIndex = 0;
    }

    const baseLocation = dummyLocations[this.currentLocationIndex];
    const speed = Math.floor(Math.random() * 60) + 20;

    const newLocation = {
      latitude: baseLocation.latitude + (Math.random() * 0.0001 - 0.00005),
      longitude: baseLocation.longitude + (Math.random() * 0.0001 - 0.00005),
      timestamp: new Date(),
      speed,
    };

    const vehicle = await Vehicle.findOne({ vehicleId: "VEHICLE_001" });

    if (vehicle) {
      const prevLocation = vehicle.currentLocation;
      let distanceIncrement = 0;

      if (prevLocation) {
        distanceIncrement = this.calculateDistance(
          prevLocation.latitude,
          prevLocation.longitude,
          newLocation.latitude,
          newLocation.longitude
        );
      }

      const updatedStats = vehicle.stats || {
        currentSpeed: 0,
        distanceCovered: 0,
        batteryLevel: 100,
        lastUpdated: new Date(),
      };

      updatedStats.currentSpeed = speed;
      updatedStats.distanceCovered += distanceIncrement;
      updatedStats.batteryLevel = Math.max(0, updatedStats.batteryLevel - 0.1);
      updatedStats.lastUpdated = new Date();

      await Vehicle.updateOne(
        { vehicleId: "VEHICLE_001" },
        {
          $set: {
            currentLocation: newLocation,
            stats: updatedStats,
            lastUpdated: new Date(),
          },
          $push: {
            locationHistory: {
              $each: [newLocation],
              $slice: -1000, // Keep latest 1000 records
            },
          },
        }
      );

      console.log(
        `📍 Vehicle moved to: ${newLocation.latitude.toFixed(6)}, ${newLocation.longitude.toFixed(6)} at ${speed} km/h`
      );
    }

    this.currentLocationIndex++;
  } catch (error) {
    console.error("Error simulating movement:", error);
  }
}

  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  async getCurrentLocation() {
    try {
      const vehicle = await Vehicle.findOne({ vehicleId: "VEHICLE_001" });
      if (!vehicle) throw new Error("Vehicle not found");
      return vehicle.currentLocation;
    } catch (error) {
      throw new Error(`Failed to get current location: ${error.message}`);
    }
  }

  async getVehicleStats() {
    try {
      const vehicle = await Vehicle.findOne({ vehicleId: "VEHICLE_001" });
      if (!vehicle) throw new Error("Vehicle not found");
      return vehicle.stats;
    } catch (error) {
      throw new Error(`Failed to get vehicle statistics: ${error.message}`);
    }
  }

  async getRouteByDate(dateString) {
    try {
      const vehicle = await Vehicle.findOne({ vehicleId: "VEHICLE_001" });
      if (!vehicle) throw new Error("Vehicle not found");

      const targetDate = new Date(dateString);
      const dayStart = startOfDay(targetDate);
      const dayEnd = endOfDay(targetDate);

      const dayRoute = vehicle.locationHistory.filter((location) => {
        const locationDate = new Date(location.timestamp);
        return locationDate >= dayStart && locationDate <= dayEnd;
      });

      return dayRoute.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    } catch (error) {
      throw new Error(`Failed to get route by date: ${error.message}`);
    }
  }

  async getLocationHistory(limit = 50) {
    try {
      const vehicle = await Vehicle.findOne({ vehicleId: "VEHICLE_001" });
      if (!vehicle) throw new Error("Vehicle not found");

      return vehicle.locationHistory
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, limit);
    } catch (error) {
      throw new Error(`Failed to get location history: ${error.message}`);
    }
  }

  async getCompleteRoute() {
    try {
      const vehicle = await Vehicle.findOne({ vehicleId: "VEHICLE_001" });
      if (!vehicle) throw new Error("Vehicle not found");

      return {
        vehicleId: vehicle.vehicleId,
        name: vehicle.name,
        currentLocation: vehicle.currentLocation,
        locationHistory: vehicle.locationHistory,
        stats: vehicle.stats,
        totalPoints: vehicle.locationHistory.length,
        isActive: vehicle.isActive,
        lastUpdated: vehicle.lastUpdated,
      };
    } catch (error) {
      throw new Error(`Failed to get complete route: ${error.message}`);
    }
  }

  async updateLocation(latitude, longitude, speed = 0) {
    try {
      const newLocation = {
        latitude,
        longitude,
        timestamp: new Date(),
        speed,
      };

      const vehicle = await Vehicle.findOne({ vehicleId: "VEHICLE_001" });
      if (!vehicle) throw new Error("Vehicle not found");

      const prevLocation = vehicle.currentLocation;
      let distanceIncrement = 0;

      if (prevLocation) {
        distanceIncrement = this.calculateDistance(
          prevLocation.latitude,
          prevLocation.longitude,
          latitude,
          longitude
        );
      }

      if (!vehicle.stats) {
        vehicle.stats = {
          currentSpeed: 0,
          distanceCovered: 0,
          batteryLevel: 100,
          lastUpdated: new Date(),
        };
      }

      vehicle.currentLocation = newLocation;
      vehicle.locationHistory.push(newLocation);
      vehicle.stats.currentSpeed = speed;
      vehicle.stats.distanceCovered += distanceIncrement;
      vehicle.stats.lastUpdated = new Date();
      vehicle.lastUpdated = new Date();

      await vehicle.save();
      return vehicle;
    } catch (error) {
      throw new Error(`Failed to update location: ${error.message}`);
    }
  }

  async getVehicleById(vehicleId) {
    try {
      return await Vehicle.findOne({ vehicleId });
    } catch (error) {
      throw new Error(`Failed to get vehicle: ${error.message}`);
    }
  }

  async getAllVehicles() {
    try {
      return await Vehicle.find({});
    } catch (error) {
      throw new Error(`Failed to get vehicles: ${error.message}`);
    }
  }

  stopSimulation() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      console.log("🛑 Vehicle location simulation stopped");
    }
  }
}

module.exports = new VehicleService();
