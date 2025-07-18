// src/components/Gallery.js
import React, { useEffect, useState } from 'react';
import './Gallery.css';

const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null); // State for the currently selected photo

  useEffect(() => {
    // Correct fetch path for a file in the public folder
    fetch('/photos.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => setPhotos(data))
      .catch(error => console.error('Error loading photos:', error));
  }, []);

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
