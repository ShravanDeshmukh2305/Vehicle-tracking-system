"use client"

import { useState, useEffect } from "react"
import MapComponent from "../components/MapComponent"
import Loader from "../components/Loader"
import ConfigurePanel from "../components/ConfigurePanel"
import PlaybackControls from "../components/PlaybackControls"
import { getCurrentLocation, getVehicleStats, getRouteByDate } from "../api/axiosInstance"
import { format, subDays } from "date-fns"
import "../styles/home.scss"

const Home = () => {
  const [currentLocation, setCurrentLocation] = useState(null)
  const [vehicleStats, setVehicleStats] = useState(null)
  const [routeData, setRouteData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isTracking, setIsTracking] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackPosition, setPlaybackPosition] = useState(0)
  const [showConfigure, setShowConfigure] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)

  
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i)
    return {
      date: format(date, "yyyy-MM-dd"),
      label: format(date, "EEEE, MMM dd"),
      isToday: i === 0,
    }
  })

  const fetchCurrentLocation = async () => {
    try {
      const response = await getCurrentLocation()
      setCurrentLocation(response.data.location)
      setError(null)
    } catch (err) {
      setError("Failed to fetch current location")
      console.error("Error fetching current location:", err)
    }
  }

  const fetchVehicleStats = async () => {
    try {
      const response = await getVehicleStats()
      setVehicleStats(response.data.stats)
    } catch (err) {
      console.error("Error fetching vehicle stats:", err)
    }
  }

  const fetchRouteByDate = async (date) => {
    try {
      setLoading(true)
      const response = await getRouteByDate(date)
      setRouteData(response.data.route)
      setPlaybackPosition(0)
      setIsPlaying(false)
      setError(null)
      
      setIsTracking(false)
    } catch (err) {
      setError("Failed to fetch route data")
      console.error("Error fetching route data:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date)
    setShowConfigure(false)
    fetchRouteByDate(date)
  }

  const startTracking = () => {
    setIsTracking(true)
    setRouteData([]) 
    setSelectedDate(null) 
    const interval = setInterval(() => {
      fetchCurrentLocation()
      fetchVehicleStats()
    }, 3000)

    return () => clearInterval(interval)
  }

  const stopTracking = () => {
    setIsTracking(false)
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleStop = () => {
    setIsPlaying(false)
    setPlaybackPosition(0)
  }

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed)
  }

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true)
      await Promise.all([fetchCurrentLocation(), fetchVehicleStats()])
      setLoading(false)
    }

    initializeData()
  }, [])

  useEffect(() => {
    let cleanup
    if (isTracking) {
      cleanup = startTracking()
    }
    return cleanup
  }, [isTracking])

  if (loading && !currentLocation) {
    return <Loader />
  }

  return (
    <div className="home">
      
      <div className="home-header">
        <h1>🚗 Vehicle Tracker</h1>
        <div className="header-controls">
          <button
            className={`btn ${isTracking ? "btn-danger" : "btn-primary"}`}
            onClick={isTracking ? stopTracking : () => setIsTracking(true)}
          >
            {isTracking ? "Stop Live" : "Start Live"}
          </button>
          <div className="status">
            <span className={`status-dot ${isTracking ? "active" : "inactive"}`}></span>
            {isTracking ? "Live" : "Offline"}
          </div>
        </div>
      </div>

      
      <div className="map-container">
        <MapComponent
          currentLocation={currentLocation}
          vehicleStats={vehicleStats}
          routeData={routeData}
          isTracking={isTracking}
          isPlaying={isPlaying}
          playbackPosition={playbackPosition}
          playbackSpeed={playbackSpeed}
          onPlaybackPositionChange={setPlaybackPosition}
        />

        
        <div className="map-controls">
          
          <button
            className={`configure-btn ${showConfigure ? "open" : ""}`}
            onClick={() => setShowConfigure(!showConfigure)}
          >
            Configure
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 10l5 5 5-5z" />
            </svg>
          </button>

          
          {showConfigure && (
            <ConfigurePanel
              days={last7Days}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              onClose={() => setShowConfigure(false)}
            />
          )}
        </div>

        
        {error && (
          <div className="error-overlay">
            <div className="error-message">{error}</div>
          </div>
        )}
      </div>

      
      {routeData.length > 0 && (
        <PlaybackControls
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onStop={handleStop}
          onSpeedChange={handleSpeedChange}
          routeLength={routeData.length}
          currentPosition={playbackPosition}
          playbackSpeed={playbackSpeed}
        />
      )}
    </div>
  )
}

export default Home
