import { useState } from 'react';
import PropTypes from 'prop-types';

function TrailerCard({ trailer }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [imageError, setImageError] = useState(false);

  const embedUrl = `https://www.youtube.com/embed/${trailer.link}?autoplay=1&modestbranding=1&iv_load_policy=3&rel=0&showinfo=0&theme=light&color=white`;
  const watchUrl = `https://www.youtube.com/watch?v=${trailer.link}`;

  // YouTube thumbnail - use maxresdefault for best quality, fallback to hqdefault
  const thumbnailUrl = trailer.thumbnail || `https://img.youtube.com/vi/${trailer.link}/maxresdefault.jpg`;
  const fallbackThumbnail = `https://img.youtube.com/vi/${trailer.link}/hqdefault.jpg`;

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
    }
  };

  return (
    <article className="trailer-card">
      <div className="video-container">
        {!isPlaying ? (
          <div className="thumbnail-container" onClick={handlePlay}>
            <img
              src={imageError ? fallbackThumbnail : thumbnailUrl}
              alt={trailer.name}
              className="thumbnail-image"
              onError={handleImageError}
              loading="lazy"
            />
            <div className="play-button-overlay">
              <svg className="play-icon" viewBox="0 0 68 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#f00"></path>
                <path d="M 45,24 27,14 27,34" fill="#fff"></path>
              </svg>
            </div>
          </div>
        ) : (
          <iframe
            src={embedUrl}
            title={trailer.name}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>

      <div className="trailer-info">
        <h3 className="trailer-title">
          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Watch ${trailer.name} on YouTube`}
          >
            {trailer.name}
          </a>
        </h3>

        <div className="trailer-meta">
          <p className="channel">
            <span className="label">From:</span> {trailer.channel}
          </p>
          <p className="date">
            <span className="label">Posted:</span> {trailer.date}
          </p>
        </div>
      </div>
    </article>
  );
}

TrailerCard.propTypes = {
  trailer: PropTypes.shape({
    channel: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired
  }).isRequired
};

export default TrailerCard;
