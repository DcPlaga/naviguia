import React from 'react';
import { Link } from 'react-router-dom';
import '../src/styles/Home.css';

function Home() {
  return (
    <div className="home-container">
      <header className="navbar">
        <div className="navbar-left">
          <span role="img" aria-label="logo">🧭</span>
          <h1 className="app-title">NaviGuía</h1>
        </div>
        <div className="navbar-right">
          <Link to="/registro" className="nav-button">Registrarse</Link>
          <Link to="/login" className="nav-button login">Iniciar Sesión</Link>
        </div>
      </header>

      <main className="home-content">
        <div className="welcome-box">
          <div className="welcome-text">
            <h2>Bienvenido a la App de Navegación Accesible</h2>
            <p>Conecta personas con discapacidad visual, acompañantes y conductores para una movilidad más inclusiva en Cali.</p>

            <h3>¿Cómo funciona?</h3>
            <p>Nuestra plataforma permite que las personas con discapacidad visual accedan a rutas de transporte público con ayuda de acompañantes o conductores registrados.</p>
          </div>
          <img
            src="/NaviGuiaHome.jpeg"
            alt="Ilustración de la app"
            className="welcome-image"
          />
          <Link to="/mapa" className="nav-button" style={{ marginTop: '20px' }}>
            Explora el Mapa
          </Link>

        </div>
      </main>
    </div>
  );
}

export default Home;
