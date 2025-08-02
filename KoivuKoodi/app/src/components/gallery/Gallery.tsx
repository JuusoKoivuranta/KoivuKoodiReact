// src/components/Gallery.tsx
import React, { useState, useEffect } from 'react';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase/config';
import './Gallery.css';

interface Photo {
  id: number;
  src: string;
  description: string;
  name: string;
}

const Gallery: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch images from Firebase Storage
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Create a reference to the gallery folder in Firebase Storage
        const galleryRef = ref(storage, 'gallery');
        
        // List all items in the gallery folder
        const result = await listAll(galleryRef);
        
        // Get download URLs for all images
        const photoPromises = result.items.map(async (imageRef, index) => {
          const url = await getDownloadURL(imageRef);
          return {
            id: index + 1,
            src: url,
            description: `Image ${index + 1}`,
            name: imageRef.name
          };
        });
        
        const photosData = await Promise.all(photoPromises);
        setPhotos(photosData);
      } catch (err) {
        console.error('Error fetching images:', err);
        setError('Failed to load images from Firebase Storage');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Close the modal when clicking outside the image or pressing escape
  const closeModal = (): void => setSelectedPhoto(null);

  return (
    <div>
      {/* Loading state */}
      {loading && (
        <div className="loading">
          <p>Loading images...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="error">
          <p>{error}</p>
        </div>
      )}

      {/* Gallery */}
      {!loading && !error && (
        <div className="gallery">
          {photos.map(photo => (
            <img
              key={photo.id}
              src={photo.src}
              alt={photo.description}
              onClick={() => setSelectedPhoto(photo)}
              className="gallery-photo"
            />
          ))}
        </div>
      )}

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
