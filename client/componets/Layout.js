import React, { Suspense } from 'react';
import { withRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';

function Layout({ route }) {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        {renderRoutes(route.routes)}
      </Suspense>
    </div>
  );
}

export default withRouter(Layout);
