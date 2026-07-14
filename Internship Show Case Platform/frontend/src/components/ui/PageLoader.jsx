import LoadingSpinner from './LoadingSpinner';

const PageLoader = ({ message = 'Loading...' }) => {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
      <LoadingSpinner size="lg" />
      <p className="font-display text-sm text-muted">{message}</p>
    </div>
  );
};

export default PageLoader;
