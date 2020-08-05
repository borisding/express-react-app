import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import routes from './routes';

function render(AppRoutes) {
  ReactDOM.render(
    <Router>{renderRoutes(AppRoutes)}</Router>,
    document.getElementById('root')
  );
}

render(routes);
