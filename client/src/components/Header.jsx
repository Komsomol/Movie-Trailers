import PropTypes from 'prop-types';

function Header({ onRefresh, loading }) {
  return (
    <header className="header">
      <div className="header-content">
        <h1>Latest Movie Trailers</h1>
        <p className="subtitle">Official trailers from the last 10 days</p>
      </div>
      <button
        className="refresh-button"
        onClick={onRefresh}
        disabled={loading}
        aria-label="Refresh trailers"
      >
        {loading ? 'Loading...' : 'Refresh'}
      </button>
    </header>
  );
}

Header.propTypes = {
  onRefresh: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
};

export default Header;
