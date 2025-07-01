"use client"

import "../styles/playback-controls.scss"

const PlaybackControls = ({
  isPlaying,
  onPlayPause,
  onStop,
  onSpeedChange,
  routeLength,
  currentPosition,
  playbackSpeed,
}) => {
  const progressPercentage = routeLength > 0 ? (currentPosition / routeLength) * 100 : 0

  return (
    <div className="playback-controls">
      
      <div className="progress-section">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPercentage}%` }}>
            <div className="progress-thumb"></div>
          </div>
        </div>
      </div>

      
      <div className="controls-section">
        <button className={`play-btn ${isPlaying ? "playing" : ""}`} onClick={onPlayPause}>
          {isPlaying ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <button className="view-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
          </svg>
        </button>
      </div>

     
      <div className="speed-section">
        <div className="speed-slider">
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.5"
            value={playbackSpeed}
            onChange={(e) => onSpeedChange(Number.parseFloat(e.target.value))}
          />
        </div>
        <div className="speed-display">{playbackSpeed}x</div>
      </div>
    </div>
  )
}

export default PlaybackControls

