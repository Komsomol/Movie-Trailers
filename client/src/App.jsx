import { useState, useEffect, useCallback } from 'react';
import TrailerList from './components/TrailerList';
import Header from './components/Header';
import ErrorMessage from './components/ErrorMessage';
import Loading from './components/Loading';
import StudioFilter from './components/StudioFilter';
import Pagination from './components/Pagination';
import './App.css';

const TRAILERS_PER_PAGE = 10;
const AUTOPLAY_INTERVAL = 30000; // 30 seconds per page

function App() {
  const [trailers, setTrailers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudio, setSelectedStudio] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [autoPlay, setAutoPlay] = useState(false);

  useEffect(() => {
    fetchTrailers();
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay) return;

    const filteredTrailers = getFilteredTrailers();
    const totalPages = Math.ceil(filteredTrailers.length / TRAILERS_PER_PAGE);

    const timer = setInterval(() => {
      setCurrentPage(prev => {
        if (prev >= totalPages) return 1;
        return prev + 1;
      });
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(timer);
  }, [autoPlay, selectedStudio, trailers]);

  const fetchTrailers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.apiValid === false) {
        throw new Error(data.error?.message || 'API validation failed');
      }

      setTrailers(data);
    } catch (err) {
      console.error('Error fetching trailers:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchTrailers();
  };

  const getFilteredTrailers = useCallback(() => {
    if (selectedStudio === 'all') {
      return trailers;
    }
    return trailers.filter(t => t.channel === selectedStudio);
  }, [trailers, selectedStudio]);

  const getStudioCounts = useCallback(() => {
    const counts = trailers.reduce((acc, trailer) => {
      acc[trailer.channel] = (acc[trailer.channel] || 0) + 1;
      return acc;
    }, {});

    const studios = Object.keys(counts).map(name => ({
      name,
      count: counts[name]
    }));

    studios.unshift({ name: 'all', count: trailers.length });
    return studios;
  }, [trailers]);

  const handleFilterChange = (studio) => {
    setSelectedStudio(studio);
    setCurrentPage(1);
    setAutoPlay(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAutoPlayToggle = () => {
    setAutoPlay(!autoPlay);
    if (!autoPlay) {
      setCurrentPage(1);
    }
  };

  const filteredTrailers = getFilteredTrailers();
  const totalPages = Math.ceil(filteredTrailers.length / TRAILERS_PER_PAGE);
  const startIndex = (currentPage - 1) * TRAILERS_PER_PAGE;
  const paginatedTrailers = filteredTrailers.slice(startIndex, startIndex + TRAILERS_PER_PAGE);

  return (
    <div className="app">
      <Header onRefresh={handleRefresh} loading={loading} />

      {!loading && !error && trailers.length > 0 && (
        <StudioFilter
          studios={getStudioCounts()}
          selectedStudio={selectedStudio}
          onFilterChange={handleFilterChange}
        />
      )}

      <main className="main-content">
        {loading && <Loading />}

        {error && !loading && (
          <ErrorMessage message={error} onRetry={handleRefresh} />
        )}

        {!loading && !error && trailers.length === 0 && (
          <div className="no-trailers">
            <h2>No Trailers Found</h2>
            <p>Check back soon for the latest movie trailers!</p>
          </div>
        )}

        {!loading && !error && filteredTrailers.length === 0 && trailers.length > 0 && (
          <div className="no-trailers">
            <h2>No Trailers from {selectedStudio}</h2>
            <p>Try selecting a different studio or view all trailers.</p>
          </div>
        )}

        {!loading && !error && paginatedTrailers.length > 0 && (
          <>
            <div className="trailer-showcase">
              <TrailerList trailers={paginatedTrailers} />
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              autoPlay={autoPlay}
              onAutoPlayToggle={handleAutoPlayToggle}
            />
          </>
        )}
      </main>

      <footer className="footer">
        <div className="footer-content">
          <p className="footer-stats">
            {filteredTrailers.length} {selectedStudio === 'all' ? 'total' : selectedStudio} trailers
            {selectedStudio === 'all' && ` from ${getStudioCounts().length - 1} studios`}
          </p>
          <p className="footer-tagline">Powered by YouTube • Updated every 5 minutes</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
