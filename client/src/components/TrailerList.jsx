import PropTypes from 'prop-types';
import TrailerCard from './TrailerCard';

function TrailerList({ trailers }) {
  return (
    <div className="trailer-list">
      {trailers.map((trailer, index) => (
        <TrailerCard key={`${trailer.link}-${index}`} trailer={trailer} />
      ))}
    </div>
  );
}

TrailerList.propTypes = {
  trailers: PropTypes.arrayOf(
    PropTypes.shape({
      channel: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
      thumbnail: PropTypes.string.isRequired
    })
  ).isRequired
};

export default TrailerList;
