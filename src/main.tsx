import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css';
import App from './App';
import About from './pages/About';
import Home from './pages/Home';
import Info from './pages/Info';
import Saved from './pages/Saved';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import ListingDetails from './pages/ListingDetails';
import Reviews from './pages/Reviews';
import { ListingsProvider } from './state/ListingsContext';
import AppErrorBoundary from './components/AppErrorBoundary';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ListingsProvider>
        <App />
      </ListingsProvider>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'info', element: <Info /> },
      { path: 'saved', element: <Saved /> },
      { path: 'messages', element: <Messages /> },
      { path: 'profile', element: <Profile /> },
      { path: 'listing/:id', element: <ListingDetails /> },
      { path: 'listing/:id/reviews', element: <Reviews /> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppErrorBoundary>
      <RouterProvider router={router} />
    </AppErrorBoundary>
  </StrictMode>
);
