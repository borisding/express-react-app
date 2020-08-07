import React from 'react';
import { isDev } from '../../utils';

export default function ErrorFallback({ error, componentStack }) {
  return (
    <div role="alert">
      <h2>Something went wrong:</h2>
      {isDev && (
        <p style={{ color: 'red' }}>
          <pre>{error.message}</pre>
          <pre>{componentStack}</pre>
        </p>
      )}
    </div>
  );
}
