import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleRefresh = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    });
    window.location.reload();
  };

  toggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, showDetails } = this.state;

      return (
        <div className='flex min-h-screen items-center justify-center bg-gray-50 p-4'>
          <div className='w-full max-w-md rounded-lg bg-white p-8 shadow-md'>
            <div className='mb-6 text-center'>
              <svg
                className='mx-auto h-16 w-16 text-red-500'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                />
              </svg>
              <h2 className='mt-4 text-2xl font-bold text-red-600'>Something went wrong</h2>
            </div>

            <p className='mb-4 text-gray-700'>We're sorry, but an unexpected error occurred.</p>

            {error && (
              <div className='mb-4 rounded border border-red-100 bg-red-50 p-3'>
                <p className='font-medium text-red-700'>{error.toString()}</p>
              </div>
            )}

            <div className='mb-6'>
              <button
                onClick={this.toggleDetails}
                className='mb-2 text-sm text-blue-600 hover:underline'
              >
                {showDetails ? 'Hide details' : 'Show error details'}
              </button>

              {showDetails && errorInfo && (
                <div className='mt-2 overflow-auto rounded bg-gray-100 p-3 text-xs'>
                  <pre className='whitespace-pre-wrap'>{errorInfo.componentStack}</pre>
                </div>
              )}
            </div>

            <div className='flex flex-col gap-3 sm:flex-row'>
              <button
                onClick={this.handleRefresh}
                className='flex-1 rounded bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700'
              >
                Refresh Page
              </button>
              <button
                onClick={() => window.history.back()}
                className='flex-1 rounded bg-gray-200 px-4 py-2 font-medium text-gray-800 transition hover:bg-gray-300'
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
