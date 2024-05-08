  import React from 'react';
  import ReactDOM from 'react-dom/client';
  import './index.css';
  import App from './App';
  import { BrowserRouter, Route, RouteObject, RouterProvider, createBrowserRouter } from "react-router-dom";
  import LandingPage from './components/LandingPage';
  import { Provider } from 'react-redux'
  import store from './store'
  import BoardComponents from './components/BoardComponents';
  import Home from './components/Home';
  import AccountVerify from './components/AccountVerify';
  import InvitationPage from './components/InvitationPage';
  import Login from './components/Login';
import CalendarView from './components/CalendarView';
import Points from './components/Points';
import AllBoards from './components/AllBoards';
import ResetPassword from './components/ResetPassword';

  const root = ReactDOM.createRoot(
    document.getElementById('root')
  );


  const router = createBrowserRouter([
    {
      path: '/',
      element: <App />,
      children: [
        {
          path: 'boards',
          element: <AllBoards />,
        },
        {
          path: 'boards/:boardId',
          element: <BoardComponents />,
        },
        {
        path: 'boards/:boardId/calendarView',
        element: <CalendarView />
        },
        {
          path: '/progress',
          element: <Points />
        },
        {
          path: "/landing",
          element: <LandingPage />,
        }

      ]
    },
  
    {
      path: "user/:id/verify/:token",
      element: <AccountVerify />
    },
    {
      path: "board/:boardId/join/:userId",
      element: <InvitationPage />
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/resetPassword/:token",
      element: <ResetPassword />,
    },
    
    
  ]);

  root.render(
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>

  );
