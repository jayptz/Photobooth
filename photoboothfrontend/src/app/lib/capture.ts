export interface CaptureOptions {
  width: number;
  height: number;
  mirrored: boolean;
  filter?: string;
}

/**
 * Captures the current frame from a video element to a data URL
 * @param video - The video element to capture from
 * @param opts - Capture options including dimensions and mirroring
 * @returns Data URL string of the captured image
 */
export function captureFromVideo(
  video: HTMLVideoElement, 
  opts: CaptureOptions
): string {
  const { width, height, mirrored, filter } = opts;
  
  // Create a canvas element
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }
  
  // Set canvas dimensions
  canvas.width = width;
  canvas.height = height;
  
  // Apply filters to the canvas context if specified
  if (filter && filter !== 'none') {
    applyFilterToContext(ctx, filter);
  }
  
  if (mirrored) {
    // Flip horizontally by scaling and translating
    ctx.scale(-1, 1);
    ctx.translate(-width, 0);
  }
  
  // Draw the video frame to canvas
  ctx.drawImage(video, 0, 0, width, height);
  
  // Return the data URL
  return canvas.toDataURL('image/png');
}

/**
 * Applies CSS filter effects to canvas context
 * Note: This is a simplified approach. For complex filters,
 * we'd need to use WebGL or CSS filter mapping to canvas operations
 */
function applyFilterToContext(ctx: CanvasRenderingContext2D, filter: string): void {
  switch (filter) {
    case 'bw':
      // Grayscale effect - simplified approximation
      ctx.filter = 'grayscale(100%) contrast(110%)';
      break;
    case 'sepia':
      ctx.filter = 'sepia(100%) contrast(110%) saturate(110%)';
      break;
    case 'duo':
      ctx.filter = 'grayscale(100%) contrast(140%) brightness(110%)';
      break;
    case 'pixel':
      // Pixel effect - we'll handle this differently in the component
      // by scaling down and up
      break;
    default:
      ctx.filter = 'none';
  }
}

/**
 * Creates a pixelated effect by scaling down and up
 * @param video - The video element
 * @param opts - Capture options
 * @returns Data URL string of the pixelated image
 */
export function capturePixelated(
  video: HTMLVideoElement,
  opts: CaptureOptions
): string {
  const { width, height, mirrored } = opts;
  
  // Create a smaller canvas for the pixelated effect
  const scale = 0.1; // Scale down to 10% then back up
  const smallCanvas = document.createElement('canvas');
  const smallCtx = smallCanvas.getContext('2d');
  
  if (!smallCtx) {
    throw new Error('Failed to get canvas context');
  }
  
  smallCanvas.width = width * scale;
  smallCanvas.height = height * scale;
  
  if (mirrored) {
    smallCtx.scale(-1, 1);
    smallCtx.translate(-width * scale, 0);
  }
  
  // Draw video at small size
  smallCtx.drawImage(video, 0, 0, width * scale, height * scale);
  
  // Create full-size canvas and scale up the small image
  const fullCanvas = document.createElement('canvas');
  const fullCtx = fullCanvas.getContext('2d');
  
  if (!fullCtx) {
    throw new Error('Failed to get canvas context');
  }
  
  fullCanvas.width = width;
  fullCanvas.height = height;
  
  // Use nearest neighbor scaling for pixelated effect
  fullCtx.imageSmoothingEnabled = false;
  fullCtx.drawImage(smallCanvas, 0, 0, width, height);
  
  return fullCanvas.toDataURL('image/png');
}
