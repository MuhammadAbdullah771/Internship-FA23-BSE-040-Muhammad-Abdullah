import { useEffect, useState } from 'react';
import { checkHealth } from '../api/health';
import PageLoader from '../components/ui/PageLoader';
import ErrorMessage from '../components/ui/ErrorMessage';

const ApiStatus = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  const loadStatus = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await checkHealth();
      setData(response.data);
    } catch (err) {
      setData(null);
      setError(err.message || 'Unable to reach the API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-ink">
        API Status
      </h1>
      <p className="mt-2 text-muted">
        Verifies frontend Axios wiring and backend availability.
      </p>

      <div className="mt-8">
        {loading && <PageLoader message="Checking API health..." />}

        {!loading && error && (
          <ErrorMessage
            title="API unreachable"
            message={error}
            onRetry={loadStatus}
          />
        )}

        {!loading && !error && data && (
          <div className="rounded-xl border border-line bg-white p-6">
            <p className="font-display text-lg font-semibold text-brand-700">
              {data.message}
            </p>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-4 border-b border-line py-2">
                <dt className="text-muted">Success</dt>
                <dd className="font-medium text-ink">
                  {String(data.success)}
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-line py-2">
                <dt className="text-muted">Database</dt>
                <dd className="font-medium text-ink">
                  {data.data?.database}
                </dd>
              </div>
              <div className="flex justify-between gap-4 py-2">
                <dt className="text-muted">Timestamp</dt>
                <dd className="font-medium text-ink">
                  {data.data?.timestamp}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </section>
  );
};

export default ApiStatus;
