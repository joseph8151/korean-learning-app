import { useCallback, useEffect, useState } from 'react';

export interface AsyncDataState<T> {
  data: T | null;
  loading: boolean;
  error: boolean;
  reload: () => void;
}

interface InternalState<T> {
  loaderId: unknown;
  nonce: number;
  data: T | null;
  loading: boolean;
  error: boolean;
}

/**
 * Single loading/empty/error contract for every data-backed screen so the UI
 * never needs to know where the data came from.
 *
 * `loader` must be memoised by the caller (useCallback); its identity is what
 * triggers a refetch.
 */
export function useAsyncData<T>(loader: () => Promise<T>): AsyncDataState<T> {
  const [state, setState] = useState<InternalState<T>>({
    loaderId: loader,
    nonce: 0,
    data: null,
    loading: true,
    error: false,
  });

  // Reset to the loading state when the loader changes, without an extra
  // effect pass. This is the React-sanctioned "adjust state during render"
  // pattern for deriving state from props.
  if (state.loaderId !== loader) {
    setState({ loaderId: loader, nonce: 0, data: null, loading: true, error: false });
  }

  useEffect(() => {
    let cancelled = false;

    loader()
      .then((result) => {
        if (cancelled) return;
        setState({ loaderId: loader, nonce: state.nonce, data: result, loading: false, error: false });
      })
      .catch(() => {
        if (cancelled) return;
        setState({ loaderId: loader, nonce: state.nonce, data: null, loading: false, error: true });
      });

    return () => {
      cancelled = true;
    };
    // `state.nonce` is a refetch trigger, not a data dependency.
  }, [loader, state.nonce]);

  const reload = useCallback(() => {
    setState((current) => ({ ...current, nonce: current.nonce + 1, loading: true, error: false }));
  }, []);

  return {
    data: state.loaderId === loader ? state.data : null,
    loading: state.loaderId === loader ? state.loading : true,
    error: state.loaderId === loader ? state.error : false,
    reload,
  };
}
