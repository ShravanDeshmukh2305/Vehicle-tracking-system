const vehicleService = require("../services/vehicleService")

class VehicleController {
 
  async getCurrentLocation(req, res) {
    try {
      const location = await vehicleService.getCurrentLocation()

      res.json({
        success: true,
        location,
        message: "Current location retrieved successfully",
      })
    } catch (error) {
      console.error("Error getting current location:", error)
      res.status(500).json({
        success: false,
        message: "Failed to get current location",
        error: error.message,
      })
    }
  }

  
  async getVehicleStats(req, res) {
    try {
      const stats = await vehicleService.getVehicleStats()

      res.json({
        success: true,
        stats,
        message: "Vehicle statistics retrieved successfully",
      })
    } catch (error) {
      console.error("Error getting vehicle stats:", error)
      res.status(500).json({
        success: false,
        message: "Failed to get vehicle statistics",
        error: error.message,
      })
    }
  }

  
  async getRouteByDate(req, res) {
    try {
      const { date } = req.params
      const route = await vehicleService.getRouteByDate(date)

      res.json({
        success: true,
        route,
        date,
        count: route.length,
        message: "Route data retrieved successfully",
      })
    } catch (error) {
      console.error("Error getting route by date:", error)
      res.status(500).json({
        success: false,
        message: "Failed to get route data",
        error: error.message,
      })
    }
  }

  
  async getLocationHistory(req, res) {
    try {
      const { limit = 50 } = req.query
      const history = await vehicleService.getLocationHistory(Number.parseInt(limit))

      res.json({
        success: true,
        history,
        count: history.length,
        message: "Location history retrieved successfully",
      })
    } catch (error) {
      console.error("Error getting location history:", error)
      res.status(500).json({
        success: false,
        message: "Failed to get location history",
        error: error.message,
      })
    }
  }


  async getCompleteRoute(req, res) {
    try {
      const route = await vehicleService.getCompleteRoute()

      res.json({
        success: true,
        route,
        message: "Complete route data retrieved successfully",
      })
    } catch (error) {
      console.error("Error getting complete route:", error)
      res.status(500).json({
        success: false,
        message: "Failed to get complete route",
        error: error.message,
      })
    }
  }

  
  async updateLocation(req, res) {
    try {
      const { latitude, longitude, speed } = req.body

      if (!latitude || !longitude) {
        return res.status(400).json({
          success: false,
          message: "Latitude and longitude are required",
        })
      }

      const updatedVehicle = await vehicleService.updateLocation(latitude, longitude, speed)

      res.json({
        success: true,
        vehicle: updatedVehicle,
        message: "Location updated successfully",
      })
    } catch (error) {
      console.error("Error updating location:", error)
      res.status(500).json({
        success: false,
        message: "Failed to update location",
        error: error.message,
      })
    }
  }

  
  async getVehicleById(req, res) {
    try {
      const { vehicleId } = req.params
      const vehicle = await vehicleService.getVehicleById(vehicleId)

      if (!vehicle) {
        return res.status(404).json({
          success: false,
          message: "Vehicle not found",
        })
      }

      res.json({
        success: true,
        vehicle,
        message: "Vehicle data retrieved successfully",
      })
    } catch (error) {
      console.error("Error getting vehicle by ID:", error)
      res.status(500).json({
        success: false,
        message: "Failed to get vehicle data",
        error: error.message,
      })
    }
  }

  
  async getAllVehicles(req, res) {
    try {
      const vehicles = await vehicleService.getAllVehicles()

      res.json({
        success: true,
        vehicles,
        count: vehicles.length,
        message: "All vehicles retrieved successfully",
      })
    } catch (error) {
      console.error("Error getting all vehicles:", error)
      res.status(500).json({
        success: false,
        message: "Failed to get vehicles",
        error: error.message,
      })
    }
  }
}

module.exports = new VehicleController()
