import React from 'react';
import ReactDOM from 'react-dom';
import { renderRoutes } from 'react-router-config';
import routes from './routes';

function render(AppRoutes) {
  ReactDOM.render(renderRoutes(AppRoutes), document.getElementById('root'));
}

render(routes);
