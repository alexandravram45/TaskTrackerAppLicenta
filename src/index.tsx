import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, RouterProvider, createBrowserRouter } from "react-router-dom";
import LandingPage from './components/LandingPage';
import { Provider } from 'react-redux'
import store from './store'


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: "/landing",
    element: <LandingPage />,
  }
]);

root.render(
  <Provider store={store}>
      <RouterProvider router={router} />
  </Provider>
);
