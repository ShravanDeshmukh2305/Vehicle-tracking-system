import "../styles/loader.scss"

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader">
        <div className="loader-spinner"></div>
        <div className="loader-content">
          <h3>Loading OpenStreetMap...</h3>
          <p>Initializing vehicle tracking system</p>
          <div className="loader-features">
            <span>✅ Free Maps</span>
            <span>✅ Real-time Tracking</span>
            <span>✅ Route Playback</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Loader
