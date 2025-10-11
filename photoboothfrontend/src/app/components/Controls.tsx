'use client';

import { FilterType } from './VideoPreview';
import { CameraDevice } from '../hooks/useCamera';

interface ControlsProps {
  // Camera controls
  onStart: () => void;
  onStop: () => void;
  isCameraReady: boolean;
  isCameraActive: boolean;
  
  // Device selection
  devices: CameraDevice[];
  activeDeviceId: string | null;
  onSelectDevice: (deviceId: string) => void;
  
  // Filter controls
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  
  // Gallery controls
  onClear: () => void;
  hasImages: boolean;
  
  // Info
  onInfo: () => void;
}

const FILTER_OPTIONS: { value: FilterType; label: string }[] = [
  { value: 'none', label: 'No Filter' },
  { value: 'bw', label: 'Black & White' },
  { value: 'sepia', label: 'Sepia' },
  { value: 'duo', label: 'Duo Tone' },
  { value: 'pixel', label: 'Pixelated' }
];

export default function Controls({
  onStart,
  onStop,
  isCameraReady,
  isCameraActive,
  devices,
  activeDeviceId,
  onSelectDevice,
  filter,
  setFilter,
  onClear,
  hasImages,
  onInfo
}: ControlsProps) {
  const handleInfo = () => {
    alert(
      'Photobooth Privacy Notice:\n\n' +
      '• Photos are processed locally on your device\n' +
      '• No images are uploaded to any server\n' +
      '• Camera access is only used for live preview and capture\n' +
      '• All photos stay in your browser\'s memory\n' +
      '• Use HTTPS for secure camera access\n\n' +
      'Your privacy is protected! 📸'
    );
  };

  return (
    <div className="controls-container">
      {/* Camera Controls */}
      <div className="controls-row">
        {!isCameraActive ? (
          <button
            onClick={onStart}
            disabled={!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia}
            className="control-btn"
          >
            📹 Start Camera
          </button>
        ) : (
          <button
            onClick={onStop}
            className="control-btn secondary"
          >
            ⏹️ Stop Camera
          </button>
        )}
        
        <button
          onClick={handleInfo}
          className="control-btn secondary"
        >
          ℹ️ Info
        </button>
      </div>

      {/* Device Selection */}
      {devices.length > 1 && (
        <div className="controls-row">
          <select
            value={activeDeviceId || ''}
            onChange={(e) => onSelectDevice(e.target.value)}
            className="control-select"
            disabled={!isCameraActive}
          >
            <option value="">Select Camera</option>
            {devices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Filter Selection */}
      <div className="controls-row">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as FilterType)}
          className="control-select"
        >
          {FILTER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Gallery Controls */}
      {hasImages && (
        <div className="controls-row">
          <button
            onClick={onClear}
            className="control-btn secondary"
          >
            🗑️ Clear Gallery
          </button>
        </div>
      )}

      {/* Camera Status */}
      {isCameraActive && (
        <div style={{ 
          textAlign: 'center', 
          fontSize: '12px', 
          color: '#28a745',
          fontWeight: '500'
        }}>
          ✅ Camera Active
        </div>
      )}

      {/* Error Display */}
      {!isCameraReady && !navigator.mediaDevices && (
        <div style={{ 
          textAlign: 'center', 
          fontSize: '12px', 
          color: '#dc3545',
          padding: '8px',
          background: '#f8d7da',
          borderRadius: '4px',
          border: '1px solid #f5c6cb'
        }}>
          ⚠️ Camera not supported in this browser
        </div>
      )}
    </div>
  );
}
