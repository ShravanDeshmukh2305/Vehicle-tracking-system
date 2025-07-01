const express = require("express")
const vehicleController = require("../controllers/vehicleController")

const router = express.Router()

router.get("/current", vehicleController.getCurrentLocation)

router.get("/stats", vehicleController.getVehicleStats)

router.get("/history/:date", vehicleController.getRouteByDate)

router.get("/history", vehicleController.getLocationHistory)

router.get("/route", vehicleController.getCompleteRoute)

router.post("/location", vehicleController.updateLocation)

router.get("/:vehicleId", vehicleController.getVehicleById)

router.get("/", vehicleController.getAllVehicles)

module.exports = router
