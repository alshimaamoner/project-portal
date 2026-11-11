import { LoadingIndicator } from './LoadingIndicator';
import type { ComponentType } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import type { Role } from '../types';
export function withAuth<P extends object>(Component: ComponentType<P>, options?: { role?: Role }) {
  function WithAuth(props: P) {
    const { user } = useAuth();
    const location = useLocation();
    if (!user) return <Navigate to="/login" state={{ from: location.pathname + location.search + location.hash }} replace />;
    if (options?.role && user.role !== options.role) return <section className="empty"><h1>Access restricted</h1><p>You do not have access to this page.</p></section>;
    return <Component {...props} />;
  }
  WithAuth.displayName = `withAuth(${Component.displayName || Component.name || 'Component'})`;
  return WithAuth;
}
export function withLoading<P extends object>(Component: ComponentType<P>) {
  function WithLoading({ isLoading, ...props }: P & { isLoading: boolean }) {
    if (isLoading) return <LoadingIndicator />;
    return <Component {...props as P} />;
  }
  WithLoading.displayName = `withLoading(${Component.displayName || Component.name || 'Component'})`;
  return WithLoading;
}
