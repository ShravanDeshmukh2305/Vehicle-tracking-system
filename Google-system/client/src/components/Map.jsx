"use client"

import { useEffect, useRef } from "react"
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
  iconUrl:
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTUgMTFMMTIgNUwxOSAxMVYxOUg1VjExWiIgZmlsbD0iIzAwN0JGRiIgc3Ryb2tlPSIjMDA3QkZGIiBzdHJva2Utd2lkdGg9IjIiLz4KPGNpcmNsZSBjeD0iOSIgY3k9IjE2IiByPSIyIiBmaWxsPSJ3aGl0ZSIvPgo8Y2lyY2xlIGN4PSIxNSIgY3k9IjE2IiByPSIyIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
})


const MapUpdater = ({ currentLocation }) => {
  const map = useMap()

  useEffect(() => {
    if (currentLocation) {
      map.setView([currentLocation.latitude, currentLocation.longitude], map.getZoom())
    }
  }, [currentLocation, map])

  return null
}

const Map = ({ currentLocation, locationHistory, isTracking }) => {
  const mapRef = useRef()

  
  const defaultCenter = [18.559679, 73.780277]
  const center = currentLocation ? [currentLocation.latitude, currentLocation.longitude] : defaultCenter

  
  const polylineCoordinates = locationHistory.map((location) => [location.latitude, location.longitude])

  return (
    <div className="map-wrapper">
      <MapContainer center={center} zoom={15} ref={mapRef} className="leaflet-container">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        
        {currentLocation && (
          <Marker position={[currentLocation.latitude, currentLocation.longitude]} icon={vehicleIcon}>
            <Popup>
              <div className="popup-content">
                <h4>Current Vehicle Location</h4>
                <p>
                  <strong>Lat:</strong> {currentLocation.latitude.toFixed(6)}
                </p>
                <p>
                  <strong>Lng:</strong> {currentLocation.longitude.toFixed(6)}
                </p>
                <p>
                  <strong>Time:</strong> {new Date(currentLocation.timestamp).toLocaleString()}
                </p>
                <p>
                  <strong>Status:</strong>
                  <span className={`status ${isTracking ? "tracking" : "stopped"}`}>
                    {isTracking ? "Tracking" : "Stopped"}
                  </span>
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        
        {polylineCoordinates.length > 1 && (
          <Polyline positions={polylineCoordinates} color="#007BFF" weight={4} opacity={0.7} dashArray="10, 10" />
        )}

       
        {locationHistory.map((location, index) => (
          <Marker key={index} position={[location.latitude, location.longitude]} opacity={0.6}>
            <Popup>
              <div className="popup-content">
                <h4>Historical Location #{index + 1}</h4>
                <p>
                  <strong>Lat:</strong> {location.latitude.toFixed(6)}
                </p>
                <p>
                  <strong>Lng:</strong> {location.longitude.toFixed(6)}
                </p>
                <p>
                  <strong>Time:</strong> {new Date(location.timestamp).toLocaleString()}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        <MapUpdater currentLocation={currentLocation} />
      </MapContainer>

      <div className="map-info">
        <div className="info-item">
          <span className="label">Current Location:</span>
          <span className="value">
            {currentLocation
              ? `${currentLocation.latitude.toFixed(4)}, ${currentLocation.longitude.toFixed(4)}`
              : "Loading..."}
          </span>
        </div>
        <div className="info-item">
          <span className="label">History Points:</span>
          <span className="value">{locationHistory.length}</span>
        </div>
        <div className="info-item">
          <span className="label">Tracking Status:</span>
          <span className={`value ${isTracking ? "active" : "inactive"}`}>{isTracking ? "Active" : "Inactive"}</span>
        </div>
      </div>
    </div>
  )
}

export default Map
