const Vehicle = require("../models/Vehicle");
const dummyLocations = require("../data/dummyLocations.json");
const { startOfDay, endOfDay, subDays } = require("date-fns");

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
      }
    } catch (_) {
      
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
    } catch (_) {
      
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
      } catch (_) {
        
      }
    }, 5000);
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
                $slice: -1000,
              },
            },
          }
        );
      }

      this.currentLocationIndex++;
    } catch (_) {
      
    }
  }

  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  async getCurrentLocation() {
    const vehicle = await Vehicle.findOne({ vehicleId: "VEHICLE_001" });
    if (!vehicle) throw new Error("Vehicle not found");
    return vehicle.currentLocation;
  }

  async getVehicleStats() {
    const vehicle = await Vehicle.findOne({ vehicleId: "VEHICLE_001" });
    if (!vehicle) throw new Error("Vehicle not found");
    return vehicle.stats;
  }

  async getRouteByDate(dateString) {
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
  }

  async getLocationHistory(limit = 50) {
    const vehicle = await Vehicle.findOne({ vehicleId: "VEHICLE_001" });
    if (!vehicle) throw new Error("Vehicle not found");

    return vehicle.locationHistory
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }

  async getCompleteRoute() {
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
  }

  async updateLocation(latitude, longitude, speed = 0) {
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
  }

  async getVehicleById(vehicleId) {
    return await Vehicle.findOne({ vehicleId });
  }

  async getAllVehicles() {
    return await Vehicle.find({});
  }

  stopSimulation() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
    }
  }
}

module.exports = new VehicleService();
