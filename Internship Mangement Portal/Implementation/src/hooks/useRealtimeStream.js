import { useEffect, useRef } from 'react';
import { useAuth as useClerkAuth } from '@clerk/clerk-react';
import { getAccessToken } from '../services/tokenStorage';

export function useRealtimeStream(events, onEvent, { enabled = true } = {}) {
  const { isSignedIn, getToken } = useClerkAuth();
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  useEffect(() => {
    if (!enabled) return undefined;

    let source = null;
    let cancelled = false;

    async function connect() {
      let token = getAccessToken();
      if (!token && isSignedIn) {
        token = await getToken({ skipCache: true }).catch(() => null);
      }
      if (!token || cancelled) return;

      const url = `/api/events/stream?token=${encodeURIComponent(token)}`;
      source = new EventSource(url);

      const handler = (event) => {
        try {
          const payload = JSON.parse(event.data);
          onEventRef.current?.(event.type, payload);
        } catch {
          onEventRef.current?.(event.type, event.data);
        }
      };

      (events || []).forEach((name) => {
        source.addEventListener(name, handler);
      });

      source.onerror = () => {
        source?.close();
        if (!cancelled) {
          setTimeout(connect, 5000);
        }
      };
    }

    connect();

    return () => {
      cancelled = true;
      source?.close();
    };
  }, [enabled, events, isSignedIn, getToken]);
}
