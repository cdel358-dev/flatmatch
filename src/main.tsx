import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css';
import App from './App';
import About from './pages/About';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import Info from './pages/Info';
import Messages from './pages/Messages';
import ListingDetails from './pages/ListingDetails';
import NotesPage from './pages/NotesPage';
import Reviews from './pages/Reviews';
import FlatmateProfile from './pages/FlatmateProfile';
import UserProfile from './pages/UserProfile';
import ListRoom from './pages/ListRoom';
import Bookmarks from './pages/Bookmarks';
import Glossary from './pages/info/Glossary';
import Etiquette from './pages/info/Etiquette';
import Suburbs from './pages/info/Suburbs';
import TenancyChecklist from './pages/info/TenancyChecklist';
import Tips from './pages/info/Tips';
import LocationPage from './pages/Location';
import AuthPage from './pages/Auth';
import PreferencesWizard from './pages/PreferencesWizard';
import Preferences from './pages/Preferences';

import { ListingsProvider } from './state/ListingsContext';
import { NotesProvider } from './state/NotesContext';
import AppErrorBoundary from './components/AppErrorBoundary';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: (
        <ListingsProvider>
          <NotesProvider>
            <App />
          </NotesProvider>
        </ListingsProvider>
      ),
      children: [
        { index: true, element: <Home /> },
        { path: 'auth', element: <AuthPage /> },
        { path: 'preferencesWizard', element: <PreferencesWizard /> },
        { path: 'search', element: <SearchResults /> },
        { path: 'about', element: <About /> },
        { path: 'info', element: <Info /> },
        { path: 'messages', element: <Messages /> },
        { path: 'profile', element: <UserProfile /> },
        { path: 'preferences', element: <Preferences /> },
        { path: 'listing/:id', element: <ListingDetails /> },
        { path: 'listing/:id/notes', element: <NotesPage /> },
        { path: '/listing/:id/location', element: <LocationPage /> },
        { path: 'listing/:id/reviews', element: <Reviews /> },
        { path: 'listing/:id/flatmate/:mid', element: <FlatmateProfile /> },
        { path: 'user/:uid', element: <UserProfile /> },
        { path: 'list-room', element: <ListRoom /> },
        { path: 'bookmarks', element: <Bookmarks /> },
        { path: 'info/glossary', element: <Glossary /> },
        { path: 'info/etiquette', element: <Etiquette /> },
        { path: 'info/suburbs', element: <Suburbs /> },
        { path: 'info/tenancy-checklist', element: <TenancyChecklist /> },
        { path: '/info/tips', element: <Tips /> },
      ],
    },
  ],
  {
    basename: '/flatmatch', // <-- important for GitHub Pages project sites
  }
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppErrorBoundary>
      <RouterProvider router={router} />
    </AppErrorBoundary>
  </StrictMode>
);
