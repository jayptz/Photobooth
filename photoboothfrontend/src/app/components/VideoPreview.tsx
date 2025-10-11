'use client';

import { useRef, useState, useCallback } from 'react';
import { captureFromVideo, capturePixelated } from '../lib/capture';
import '../styles/filters.css';

export type FilterType = 'none' | 'bw' | 'sepia' | 'duo' | 'pixel';

interface VideoPreviewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  filter: FilterType;
  onCaptured: (dataUrl: string) => void;
}

export default function VideoPreview({ videoRef, filter, onCaptured }: VideoPreviewProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const handleCapture = useCallback(async () => {
    if (!videoRef.current || isCapturing) return;

    setIsCapturing(true);

    // Optional countdown (3-2-1)
    const doCountdown = true; // Could be made configurable
    
    if (doCountdown) {
      for (let i = 3; i > 0; i--) {
        setCountdown(i);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      setCountdown(null);
    }

    // Flash effect
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 150);

    try {
      const video = videoRef.current;
      const width = video.videoWidth || 640;
      const height = video.videoHeight || 480;

      let dataUrl: string;
      
      if (filter === 'pixel') {
        // Special handling for pixel filter
        dataUrl = capturePixelated(video, {
          width,
          height,
          mirrored: true // Flip horizontally so saved image looks natural
        });
      } else {
        dataUrl = captureFromVideo(video, {
          width,
          height,
          mirrored: true, // Flip horizontally so saved image looks natural
          filter
        });
      }

      onCaptured(dataUrl);
    } catch (error) {
      console.error('Capture failed:', error);
    } finally {
      setIsCapturing(false);
    }
  }, [filter, onCaptured, isCapturing]);

  return (
    <div className="photobooth-container">
      <video
        ref={videoRef}
        className={`photobooth-preview filter-${filter}`}
        playsInline
        autoPlay
        muted
        style={{ 
          filter: filter === 'pixel' ? 'none' : undefined,
          imageRendering: filter === 'pixel' ? 'pixelated' : undefined
        }}
      />
      
      {/* Frame overlay */}
      <img 
        src="/frame.svg" 
        alt="Photobooth frame"
        className="photobooth-frame"
        onError={(e) => {
          // Hide frame if image fails to load
          e.currentTarget.style.display = 'none';
        }}
      />
      
      {/* Flash overlay */}
      <div className={`flash-overlay ${showFlash ? 'active' : ''}`} />
      
      {/* Countdown overlay */}
      {countdown !== null && (
        <div className="countdown-overlay">
          {countdown}
        </div>
      )}
      
      {/* Capture button */}
      <button
        onClick={handleCapture}
        disabled={isCapturing || !videoRef.current?.videoWidth}
        className="control-btn"
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 5
        }}
      >
        {isCapturing ? 'Capturing...' : '📸 Capture'}
      </button>
    </div>
  );
}
