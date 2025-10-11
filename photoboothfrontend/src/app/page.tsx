'use client';

import { useState, useRef } from 'react';
import { useCamera } from './hooks/useCamera';
import VideoPreview, { FilterType } from './components/VideoPreview';
import Controls from './components/Controls';
import Gallery from './components/Gallery';

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [filter, setFilter] = useState<FilterType>('none');
  const [images, setImages] = useState<string[]>([]);

  const {
    start: startCamera,
    stop: stopCamera,
    devices,
    selectDevice,
    activeDeviceId,
    ready: isCameraReady,
    error: cameraError
  } = useCamera(videoRef);

  const handleCaptured = (dataUrl: string) => {
    setImages(prev => {
      // Keep only the last 12 images
      const newImages = [dataUrl, ...prev].slice(0, 12);
      return newImages;
    });
  };

  const handleClearGallery = () => {
    setImages([]);
  };

  const handleInfo = () => {
    // This will be handled by the Controls component
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#333',
            margin: '0 0 8px 0',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            📸 Photobooth
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#6c757d',
            margin: '0'
          }}>
            Take photos with your camera and apply fun filters
          </p>
        </header>

        {/* Video Preview */}
        <div style={{ marginBottom: '24px' }}>
          <VideoPreview
            videoRef={videoRef}
            filter={filter}
            onCaptured={handleCaptured}
          />
        </div>

        {/* Controls */}
        <Controls
          onStart={startCamera}
          onStop={stopCamera}
          isCameraReady={isCameraReady}
          isCameraActive={!!videoRef.current?.videoWidth}
          devices={devices}
          activeDeviceId={activeDeviceId}
          onSelectDevice={selectDevice}
          filter={filter}
          setFilter={setFilter}
          onClear={handleClearGallery}
          hasImages={images.length > 0}
          onInfo={handleInfo}
        />

        {/* Gallery */}
        {images.length > 0 && (
          <div style={{ marginTop: '32px' }}>
            <Gallery images={images} />
          </div>
        )}

        {/* Privacy Notice */}
        <div className="privacy-notice">
          <strong>Privacy Protected:</strong> Photos stay on your device. Use HTTPS for camera access.
        </div>

        {/* Camera Error Display */}
        {cameraError && (
          <div style={{
            marginTop: '20px',
            padding: '16px',
            background: '#f8d7da',
            border: '1px solid #f5c6cb',
            borderRadius: '8px',
            color: '#721c24'
          }}>
            <strong>Camera Error:</strong> {cameraError}
            <br />
            <small>
              Make sure you've granted camera permissions and are using HTTPS.
            </small>
          </div>
        )}
      </div>
    </div>
  );
}