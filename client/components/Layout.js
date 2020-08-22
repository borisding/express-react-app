import React, { Suspense } from 'react';
import { withRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback, Spinner } from './';

function Layout({ route }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<Spinner />}>{renderRoutes(route.routes)}</Suspense>
    </ErrorBoundary>
  );
}

export default withRouter(Layout);
