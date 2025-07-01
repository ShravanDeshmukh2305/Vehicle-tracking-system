const app = require("./app")
const connectDB = require("./config/db")

const PORT = process.env.PORT || 5000
connectDB()

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📍 Vehicle tracking API available at http://localhost:${PORT}/api`)
  console.log(`🗺️  OpenStreetMap integration enabled (100% Free!)`)
  console.log(`✅ No API keys required`)
})
