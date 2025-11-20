import { useState } from 'react';
import PropTypes from 'prop-types';

function StudioFilter({ studios, selectedStudio, onFilterChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleFilterClick = (studio) => {
    onFilterChange(studio);
    setIsOpen(false);
  };

  return (
    <div className="studio-filter">
      <button className="filter-toggle" onClick={toggleMenu}>
        <svg className="filter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h18M3 12h18M3 20h18" />
        </svg>
        <span>Filter by Studio</span>
      </button>

      <div className={`filter-grid ${isOpen ? 'open' : ''}`}>
        <button
          className={`studio-chip ${selectedStudio === 'all' ? 'active' : ''}`}
          onClick={() => handleFilterClick('all')}
        >
          <span className="studio-icon">🎬</span>
          <span className="studio-name">All Studios</span>
          <span className="studio-count">{studios.find(s => s.name === 'all')?.count || 0}</span>
        </button>

        {studios
          .filter(s => s.name !== 'all' && s.count > 0)
          .sort((a, b) => b.count - a.count)
          .map((studio) => (
            <button
              key={studio.name}
              className={`studio-chip ${selectedStudio === studio.name ? 'active' : ''}`}
              onClick={() => handleFilterClick(studio.name)}
              title={studio.name}
            >
              <span className="studio-icon">{getStudioIcon(studio.name)}</span>
              <span className="studio-name">{studio.name}</span>
              <span className="studio-count">{studio.count}</span>
            </button>
          ))}
      </div>
    </div>
  );
}

// Map studio names to emojis/icons
function getStudioIcon(studioName) {
  const iconMap = {
    'Netflix': '🎥',
    'Warner Bros.': '🎭',
    'Disney': '🏰',
    'Marvel': '⚡',
    'Universal': '🌍',
    'Paramount': '⛰️',
    'Sony': '📺',
    'A24': '🎨',
    'HBO': '📡',
    'Apple TV': '🍎',
    'Amazon': '📦',
    'Lionsgate': '🦁',
    'MGM': '🎪',
    'Focus Features': '🎯',
    'Illumination': '💡',
    '20th Century': '🦊',
    'Pixar': '🌟',
    'Star Wars': '⭐',
    'Legendary': '🐲',
    'Blumhouse': '👻',
    'Annapurna': '🎬',
    'Neon': '✨',
    'IFC': '🎞️',
  };

  // Try exact match first
  if (iconMap[studioName]) return iconMap[studioName];

  // Try partial match
  const key = Object.keys(iconMap).find(k =>
    studioName.toLowerCase().includes(k.toLowerCase())
  );

  return iconMap[key] || '🎬';
}

StudioFilter.propTypes = {
  studios: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired
    })
  ).isRequired,
  selectedStudio: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired
};

export default StudioFilter;
