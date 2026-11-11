import { useEffect, useState } from 'react';

export type Resource<T> =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: T };

export function useResource<T>(fetcher: () => Promise<T>) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{
    fetcher: () => Promise<T>;
    attempt: number;
    resource: Resource<T>;
  }>();

  useEffect(() => {
    let ignore = false;

    fetcher().then(
      data => {
        if (!ignore) {
          setResult({ fetcher, attempt, resource: { status: 'ready', data } });
        }
      },
      error => {
        if (!ignore) {
          setResult({
            fetcher,
            attempt,
            resource: {
              status: 'error',
              message: error instanceof Error ? error.message : 'Something went wrong.',
            },
          });
        }
      },
    );

    return () => { ignore = true; };
  }, [fetcher, attempt]);

  // A new project or retry renders loading immediately, before its effect runs.
  const resource: Resource<T> =
    result?.fetcher === fetcher && result.attempt === attempt
      ? result.resource
      : { status: 'loading' };

  return { resource, retry: () => setAttempt(value => value + 1) };
}
