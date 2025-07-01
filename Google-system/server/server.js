// const app = require("./app")
// const connectDB = require("./config/db")

// const PORT = process.env.PORT || 5000

// // Connect to MongoDB
// connectDB()

// // Start server
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`)
//   console.log(`📍 Vehicle tracking API available at http://localhost:${PORT}/api`)
// })





// require("dotenv").config(); // Make sure this comes FIRST

// const app = require("./app");
// const connectDB = require("./config/db");

// const PORT = process.env.PORT || 5000;

// // Connect to MongoDB
// connectDB();

// // Start server
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
//   console.log(`📍 Vehicle tracking API available at http://localhost:${PORT}/api`);
// });



const app = require("./app")
const connectDB = require("./config/db")

const PORT = process.env.PORT || 5000

// Connect to MongoDB
connectDB()

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📍 Vehicle tracking API available at http://localhost:${PORT}/api`)
  console.log(`🗺️  OpenStreetMap integration enabled (100% Free!)`)
  console.log(`✅ No API keys required`)
})
