import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from './pages/layout/Layout';
import HomePage from './pages/home/HomePage';
import Leaderboard from './pages/leaderboard/Leaderboard';
import Team from './pages/team/Team';
import Register from './pages/register/Register';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "home",
        element: <HomePage />
      },
      {
        path: "leaderboard",
        element: <Leaderboard />
      },
      {
        path: "team",
        element: <Team />
      },
      {
        path: "new-member",
        element: <Register />
      }
    ]
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router} />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
