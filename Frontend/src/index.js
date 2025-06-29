// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Registro from './inicioRegistro';
import RegistroDiscapacitados from './formularios/RegistroDiscapacitados';
import RegistroAcompanantes from './formularios/RegistroAcompanantes';
import RegistroConductores from './formularios/RegistroConductores';
import './styles/index.css';
import MapaCali from './MapaCali';
import Login from './login';
import Perfil from './Perfil.jsx';
import PaginaRuta from './PaginaRuta.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/ruta" element={<PaginaRuta />} />
      <Route path="/" element={<Home />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/RegistroDiscapacitados" element={<RegistroDiscapacitados />} />
      <Route path="/RegistroAcompanantes" element={<RegistroAcompanantes />} />
      <Route path="/RegistroConductores" element={<RegistroConductores />} />
      <Route path="/mapa" element={<MapaCali />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  </BrowserRouter>
);
