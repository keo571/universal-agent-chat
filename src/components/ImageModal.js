import React from 'react';
import PropTypes from 'prop-types';
import './ImageModal.css';

const ImageModal = ({ selectedImage, onClose }) => {
  if (!selectedImage) return null;

  return (
    <div className="image-modal" onClick={onClose}>
      <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
        <button 
          className="close-button"
          onClick={onClose}
        >
          ×
        </button>
        <img
          src={selectedImage}
          alt="Network Diagram - Full Size"
          className="modal-image"
        />
      </div>
    </div>
  );
};

ImageModal.propTypes = {
  selectedImage: PropTypes.string,
  onClose: PropTypes.func.isRequired
};

export default ImageModal;