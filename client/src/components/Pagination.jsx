import PropTypes from 'prop-types';

function Pagination({ currentPage, totalPages, onPageChange, autoPlay, onAutoPlayToggle }) {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <div className="pagination-controls">
        <button
          className="pagination-button"
          onClick={handlePrevious}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Previous</span>
        </button>

        <div className="page-numbers">
          {getPageNumbers().map((page, index) => (
            typeof page === 'number' ? (
              <button
                key={index}
                className={`page-number ${currentPage === page ? 'active' : ''}`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            ) : (
              <span key={index} className="page-ellipsis">{page}</span>
            )
          ))}
        </div>

        <button
          className="pagination-button"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <span>Next</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="autoplay-controls">
        <button
          className={`autoplay-button ${autoPlay ? 'active' : ''}`}
          onClick={onAutoPlayToggle}
          aria-label={autoPlay ? 'Disable auto-play' : 'Enable auto-play'}
        >
          {autoPlay ? (
            <>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
              <span>Auto-Play On</span>
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>Auto-Play Off</span>
            </>
          )}
        </button>
      </div>

      <div className="pagination-info">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  autoPlay: PropTypes.bool.isRequired,
  onAutoPlayToggle: PropTypes.func.isRequired
};

export default Pagination;
