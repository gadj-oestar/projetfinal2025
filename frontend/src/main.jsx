import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import Login from "./page/Login.jsx";
import Register from './page/Register.jsx';
import Recipes from './page/Recipes.jsx';
import History from './page/History.jsx';
import Favorites from './page/Favorites.jsx';
import MainLayout from './page/MainLayout.jsx';
import HowItWork from './page/HowItWork.jsx';
import Admin from './page/Admin.jsx';
import FavoritesTest from './page/FavoritesTest.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Pages sans Header */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Pages avec Header */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Recipes />} />
          <Route path="/app" element={<App />} />
          <Route path="/history" element={<History />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/howitwork" element={<HowItWork />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/favoritestest" element={<FavoritesTest />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
