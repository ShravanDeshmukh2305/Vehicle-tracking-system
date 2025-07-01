"use client"

import { useEffect, useRef, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet"
import L from "leaflet"
import "../styles/map.scss"


delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})


const vehicleIcon = new L.Icon({
  iconUrl: `data:image/svg+xml;base64,${btoa(`
    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="25" cy="25" r="23" fill="#FF0000" stroke="#FFFFFF" strokeWidth="4"/>
      <path d="M15 22L25 14L35 22V34H15V22Z" fill="#FFFFFF"/>
      <circle cx="20" cy="30" r="3" fill="#FF0000"/>
      <circle cx="30" cy="30" r="3" fill="#FF0000"/>
      <text x="25" y="42" fontFamily="Arial" fontSize="8" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">CAR</text>
    </svg>
  `)}`,
  iconSize: [50, 50],
  iconAnchor: [25, 25],
  popupAnchor: [0, -25],
})


const createNumberedIcon = (number, color = "#FF6B35") => {
  return new L.Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="15" cy="15" r="13" fill="${color}" stroke="#FFFFFF" strokeWidth="2"/>
        <text x="15" y="20" fontFamily="Arial" fontSize="12" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">${number}</text>
      </svg>
    `)}`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  })
}


const startIcon = new L.Icon({
  iconUrl: `data:image/svg+xml;base64,${btoa(`
    <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="17.5" cy="17.5" r="15" fill="#00AA00" stroke="#FFFFFF" strokeWidth="3"/>
      <text x="17.5" y="23" fontFamily="Arial" fontSize="14" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">S</text>
    </svg>
  `)}`,
  iconSize: [35, 35],
  iconAnchor: [17.5, 17.5],
  popupAnchor: [0, -17.5],
})


const endIcon = new L.Icon({
  iconUrl: `data:image/svg+xml;base64,${btoa(`
    <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="17.5" cy="17.5" r="15" fill="#FF0000" stroke="#FFFFFF" strokeWidth="3"/>
      <text x="17.5" y="23" fontFamily="Arial" fontSize="14" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">E</text>
    </svg>
  `)}`,
  iconSize: [35, 35],
  iconAnchor: [17.5, 17.5],
  popupAnchor: [0, -17.5],
})


const MapUpdater = ({ center, routeData, isPlaying }) => {
  const map = useMap()

  useEffect(() => {
    if (center && !isPlaying) {
      map.setView(center, 15)
    }
  }, [center, map, isPlaying])

  useEffect(() => {
    if (routeData && routeData.length > 1) {
      const bounds = L.latLngBounds(routeData.map((point) => [point.latitude, point.longitude]))
      map.fitBounds(bounds, { padding: [30, 30] })
    }
  }, [routeData, map])

  return null
}


const RoutePlayback = ({ routeData, isPlaying, playbackPosition, playbackSpeed, onPositionChange }) => {
  const intervalRef = useRef()

  useEffect(() => {
    if (isPlaying && routeData.length > 0) {
      const interval = 1000 / playbackSpeed

      intervalRef.current = setInterval(() => {
        onPositionChange((prevPosition) => {
          if (prevPosition >= routeData.length - 1) {
            return 0
          }
          return prevPosition + 1
        })
      }, interval)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, routeData.length, playbackSpeed, onPositionChange])

  return null
}

const MapComponent = ({
  currentLocation,
  vehicleStats,
  routeData,
  isTracking,
  isPlaying,
  playbackPosition,
  playbackSpeed,
  onPlaybackPositionChange,
}) => {
  const [mapCenter, setMapCenter] = useState([17.385044, 78.486671])
  const [vehiclePosition, setVehiclePosition] = useState(null)

  
  useEffect(() => {
    if (isPlaying && routeData.length > 0 && playbackPosition < routeData.length) {
      
      const currentPoint = routeData[playbackPosition]
      setVehiclePosition([currentPoint.latitude, currentPoint.longitude])
      setMapCenter([currentPoint.latitude, currentPoint.longitude])
    } else if (currentLocation && !isPlaying && isTracking) {
      
      setVehiclePosition([currentLocation.latitude, currentLocation.longitude])
      setMapCenter([currentLocation.latitude, currentLocation.longitude])
    } else if (currentLocation && !isPlaying && !isTracking && routeData.length === 0) {
     
      setVehiclePosition([currentLocation.latitude, currentLocation.longitude])
    }
  }, [currentLocation, routeData, isPlaying, playbackPosition, isTracking])

  
  const polylineCoordinates = routeData.map((location) => [location.latitude, location.longitude])

  return (
    <div className="map-wrapper">
      <MapContainer
        center={mapCenter}
        zoom={15}
        className="leaflet-container"
        zoomControl={true}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        
        {vehiclePosition && (
          <Marker position={vehiclePosition} icon={vehicleIcon} zIndexOffset={1000}>
            <Popup className="vehicle-popup">
              <div className="popup-content">
                <h3>🚗 Vehicle Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="label">Speed:</span>
                    <span className="value">{vehicleStats?.currentSpeed || 0} km/h</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Distance:</span>
                    <span className="value">{vehicleStats?.distanceCovered?.toFixed(2) || 0} km</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Battery:</span>
                    <span
                      className={`value battery-${vehicleStats?.batteryLevel > 50 ? "good" : vehicleStats?.batteryLevel > 20 ? "medium" : "low"}`}
                    >
                      {vehicleStats?.batteryLevel?.toFixed(1) || 0}%
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">Status:</span>
                    <span className={`value status-${isTracking ? "active" : "inactive"}`}>
                      {isTracking ? "Live Tracking" : isPlaying ? "Playback Mode" : "Offline"}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">Location:</span>
                    <span className="value">
                      {vehiclePosition[0].toFixed(4)}, {vehiclePosition[1].toFixed(4)}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">Time:</span>
                    <span className="value">{new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        
        {polylineCoordinates.length > 1 && (
          <Polyline positions={polylineCoordinates} color="#00AA00" weight={8} opacity={1} dashArray="15, 10" />
        )}

        
        {routeData.length > 0 && (
          <Marker position={[routeData[0].latitude, routeData[0].longitude]} icon={startIcon}>
            <Popup>
              <div className="popup-content">
                <h4>🟢 Route Start</h4>
                <p>
                  <strong>Time:</strong> {new Date(routeData[0].timestamp).toLocaleString()}
                </p>
                <p>
                  <strong>Speed:</strong> {routeData[0].speed || 0} km/h
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        
        {routeData.length > 1 && (
          <Marker
            position={[routeData[routeData.length - 1].latitude, routeData[routeData.length - 1].longitude]}
            icon={endIcon}
          >
            <Popup>
              <div className="popup-content">
                <h4>🔴 Route End</h4>
                <p>
                  <strong>Time:</strong> {new Date(routeData[routeData.length - 1].timestamp).toLocaleString()}
                </p>
                <p>
                  <strong>Speed:</strong> {routeData[routeData.length - 1].speed || 0} km/h
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        
        {routeData.length > 0 &&
          routeData.map((point, index) => {
            if (index > 0 && index < routeData.length - 1 && index % 3 === 0) {
              return (
                <Marker
                  key={index}
                  position={[point.latitude, point.longitude]}
                  icon={createNumberedIcon(Math.floor(index / 3))}
                >
                  <Popup>
                    <div className="popup-content">
                      <h4>📍 Waypoint {Math.floor(index / 3)}</h4>
                      <p>
                        <strong>Time:</strong> {new Date(point.timestamp).toLocaleString()}
                      </p>
                      <p>
                        <strong>Speed:</strong> {point.speed || 0} km/h
                      </p>
                    </div>
                  </Popup>
                </Marker>
              )
            }
            return null
          })}

        <MapUpdater center={vehiclePosition} routeData={routeData} isPlaying={isPlaying} />
        <RoutePlayback
          routeData={routeData}
          isPlaying={isPlaying}
          playbackPosition={playbackPosition}
          playbackSpeed={playbackSpeed}
          onPositionChange={onPlaybackPositionChange}
        />
      </MapContainer>

      
      <div className="map-info-overlay">
        <div className="info-panel">
          {vehicleStats && (
            <>
              <div className="info-stat">
                <span className="stat-value">{vehicleStats.currentSpeed || 0}</span>
                <span className="stat-label">km/h</span>
              </div>
              <div className="info-stat">
                <span className="stat-value">{vehicleStats.distanceCovered?.toFixed(1) || 0}</span>
                <span className="stat-label">km</span>
              </div>
              <div className="info-stat">
                <span
                  className={`stat-value battery-${vehicleStats.batteryLevel > 50 ? "good" : vehicleStats.batteryLevel > 20 ? "medium" : "low"}`}
                >
                  {vehicleStats.batteryLevel?.toFixed(0) || 0}%
                </span>
                <span className="stat-label">Battery</span>
              </div>
            </>
          )}
          {routeData.length > 0 && (
            <div className="info-stat">
              <span className="stat-value">{routeData.length}</span>
              <span className="stat-label">Points</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MapComponent

