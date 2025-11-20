import PropTypes from 'prop-types';

function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-message">
      <h2>Oops! Something went wrong</h2>
      <p>{message}</p>
      <button onClick={onRetry} className="retry-button">
        Try Again
      </button>
    </div>
  );
}

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
  onRetry: PropTypes.func.isRequired
};

export default ErrorMessage;
