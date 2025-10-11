import { useState, useCallback, useRef } from 'react';

export interface CameraDevice {
  deviceId: string;
  label: string;
}

export interface UseCameraReturn {
  start: () => Promise<void>;
  stop: () => void;
  devices: CameraDevice[];
  selectDevice: (deviceId: string) => Promise<void>;
  activeDeviceId: string | null;
  ready: boolean;
  error: string | null;
}

export function useCamera(videoRef: React.RefObject<HTMLVideoElement | null>): UseCameraReturn {
  const [devices, setDevices] = useState<CameraDevice[]>([]);
  const [activeDeviceId, setActiveDeviceId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentStreamRef = useRef<MediaStream | null>(null);

  const enumerateDevices = useCallback(async () => {
    try {
      const deviceList = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = deviceList
        .filter(device => device.kind === 'videoinput')
        .map(device => ({
          deviceId: device.deviceId,
          label: device.label || `Camera ${device.deviceId.slice(0, 8)}`
        }));
      setDevices(videoDevices);
    } catch (err) {
      console.error('Error enumerating devices:', err);
    }
  }, []);

  const start = useCallback(async () => {
    try {
      setError(null);
      
      // Stop any existing stream
      if (currentStreamRef.current) {
        currentStreamRef.current.getTracks().forEach(track => track.stop());
      }

      // Request camera access
      const constraints: MediaStreamConstraints = {
        video: activeDeviceId 
          ? { deviceId: { exact: activeDeviceId } }
          : { facingMode: 'user' },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        currentStreamRef.current = stream;
        setReady(true);
        
        // Enumerate devices after successful camera access
        await enumerateDevices();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to access camera';
      setError(errorMessage);
      setReady(false);
      console.error('Camera start error:', err);
    }
  }, [activeDeviceId, videoRef, enumerateDevices]);

  const stop = useCallback(() => {
    if (currentStreamRef.current) {
      currentStreamRef.current.getTracks().forEach(track => track.stop());
      currentStreamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setReady(false);
    setActiveDeviceId(null);
  }, [videoRef]);

  const selectDevice = useCallback(async (deviceId: string) => {
    setActiveDeviceId(deviceId);
    
    // If camera is already running, restart with new device
    if (ready) {
      await start();
    }
  }, [ready, start]);

  return {
    start,
    stop,
    devices,
    selectDevice,
    activeDeviceId,
    ready,
    error
  };
}
