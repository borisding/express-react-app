import React from 'react';
import { isDev } from '../../utils';

export default function ErrorFallback({ error }) {
  return (
    <div role="alert">
      <h2>Something went wrong:</h2>
      {isDev && (
        <p style={{ color: 'red' }}>
          <pre>{error.message}</pre>
        </p>
      )}
    </div>
  );
}
