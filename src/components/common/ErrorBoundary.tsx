import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

function getFallbackTitle() {
  if (typeof document !== 'undefined' && document.documentElement.lang === 'ar') {
    return 'حدث خطأ غير متوقع.';
  }

  return 'Something went wrong.';
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  public state: ErrorBoundaryState = {
    hasError: false,
    message: '',
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error.message,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled UI error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className='rounded-md border border-red-200 bg-red-50 p-4 text-red-700'>
          <p className='font-semibold'>{getFallbackTitle()}</p>
          <p className='mt-1 text-sm'>{this.state.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}
