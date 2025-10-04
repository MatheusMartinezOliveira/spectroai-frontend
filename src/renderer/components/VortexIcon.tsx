import React from 'react';
import '../styles/VortexIcon.css';

interface VortexIconProps {
  isActive: boolean;
}

const VortexIcon: React.FC<VortexIconProps> = ({ isActive }) => {
  return (
    <div className={`vortex-container ${isActive ? 'active' : ''}`}>
      <div className="vortex-circle vortex-1"></div>
      <div className="vortex-circle vortex-2"></div>
      <div className="vortex-circle vortex-3"></div>
      <div className="vortex-core">
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  );
};

export default VortexIcon;

