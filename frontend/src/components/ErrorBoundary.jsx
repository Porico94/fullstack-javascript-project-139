import React from 'react';
import rollbar from '../rollbar';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Enviar error a Rollbar
    rollbar.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          padding: '2rem'
        }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>😔</h1>
          <h2>Oops! Something went wrong</h2>
          <p style={{ color: '#666', marginTop: '1rem' }}>
            We've been notified and will fix it soon.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            style={{
              marginTop: '2rem',
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Go back home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;