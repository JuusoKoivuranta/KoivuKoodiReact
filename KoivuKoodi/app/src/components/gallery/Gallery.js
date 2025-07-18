// src/components/Gallery.js
import React, { useEffect, useState } from 'react';
import './Gallery.css';

const Gallery = () => {
  const [selectedPhoto, setSelectedPhoto] = useState(null); // State for the currently selected photo
  
  // Get all image files from the gallery directory
  const importAll = (r) => {
    return r.keys().map((fileName, index) => ({
      id: index + 1,
      src: `/images/gallery/${fileName.replace('./', '')}`,
      description: `Image ${index + 1}`
    }));
  };

  const photos = importAll(require.context('../../../public/images/gallery', false, /\.(png|jpe?g|webp)$/));

  // Close the modal when clicking outside the image or pressing escape
  const closeModal = () => setSelectedPhoto(null);

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
