'use client';

interface GalleryProps {
  images: string[];
}

export default function Gallery({ images }: GalleryProps) {
  if (images.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        color: '#6c757d', 
        padding: '40px 20px',
        background: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #dee2e6'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📸</div>
        <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>
          No photos yet
        </div>
        <div style={{ fontSize: '14px' }}>
          Start your camera and take some photos to see them here!
        </div>
      </div>
    );
  }

  const handleDownload = (dataUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `photobooth-${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpen = (dataUrl: string) => {
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>Photobooth Photo</title>
            <style>
              body { 
                margin: 0; 
                padding: 20px; 
                background: #000; 
                display: flex; 
                justify-content: center; 
                align-items: center; 
                min-height: 100vh;
              }
              img { 
                max-width: 100%; 
                max-height: 100vh; 
                border-radius: 8px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.3);
              }
            </style>
          </head>
          <body>
            <img src="${dataUrl}" alt="Photobooth Photo" />
          </body>
        </html>
      `);
    }
  };

  return (
    <div>
      <h3 style={{ 
        textAlign: 'center', 
        margin: '20px 0 16px 0',
        fontSize: '18px',
        fontWeight: '600',
        color: '#333'
      }}>
        📸 Gallery ({images.length})
      </h3>
      
      <div className="gallery-grid">
        {images.map((dataUrl, index) => (
          <div key={index} className="gallery-item">
            <img
              src={dataUrl}
              alt={`Photobooth photo ${index + 1}`}
              className="gallery-thumbnail"
              onClick={() => handleOpen(dataUrl)}
            />
            <div className="gallery-actions">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpen(dataUrl);
                }}
                className="gallery-btn"
                title="Open full size"
              >
                👁️ Open
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(dataUrl, index);
                }}
                className="gallery-btn"
                title="Download image"
              >
                💾 Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Show only last 12 images */}
      {images.length > 12 && (
        <div style={{ 
          textAlign: 'center', 
          fontSize: '12px', 
          color: '#6c757d',
          marginTop: '12px',
          padding: '8px',
          background: '#f8f9fa',
          borderRadius: '4px'
        }}>
          Showing latest 12 photos • {images.length - 12} older photos not displayed
        </div>
      )}
    </div>
  );
}
