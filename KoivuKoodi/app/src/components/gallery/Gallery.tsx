// src/components/Gallery.tsx
import React, { useState } from 'react';
import './Gallery.css';

interface Photo {
  id: number;
  src: string;
  description: string;
}

const Gallery: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null); // State for the currently selected photo
  
  // Get all image files from the gallery directory
  const importAll = (r: any): Photo[] => {
    return r.keys().map((fileName: string, index: number) => ({
      id: index + 1,
      src: `/images/gallery/${fileName.replace('./', '')}`,
      description: `Image ${index + 1}`
    }));
  };

  const photos = importAll((require as any).context('../../../public/images/gallery', false, /\.(png|jpe?g|webp)$/));

  // Close the modal when clicking outside the image or pressing escape
  const closeModal = (): void => setSelectedPhoto(null);

  return (
    <div>
      <div className="gallery">
        {photos.map(photo => (
          <img
            key={photo.id}
            src={photo.src}
            alt={photo.description}
            onClick={() => setSelectedPhoto(photo)} // Set the selected photo on click
            className="gallery-photo"
          />
        ))}
      </div>

      {/* Modal */}
      {selectedPhoto && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <img src={selectedPhoto.src} alt={selectedPhoto.description} className="modal-image" />
            
            <button className="close-button" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
