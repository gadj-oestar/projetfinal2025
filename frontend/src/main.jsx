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


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/history" element={<History />} />
        <Route path="/favorites" element={<Favorites />} />

      
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
