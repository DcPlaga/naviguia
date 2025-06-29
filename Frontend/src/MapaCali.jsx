import React from 'react';
import { Link } from 'react-router-dom';
import './styles/MapaCali.css';

function MapaCali() {
  return (
    <div className="mapa-container">
      <div className="mapa-box">
        <h2 className="mapa-title">Mapa de Cali</h2>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3986.7434277273347!2d-76.53635682407623!3d3.451646551437878!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e30a6da2c453cd7%3A0x85ec9ad4e3811c88!2sCali%2C%20Valle%20del%20Cauca!5e0!3m2!1ses!2sco!4v1718845394792!5m2!1ses!2sco"
          className="mapa-frame"
          allowFullScreen=""
          loading="lazy"
          title="Mapa de Cali"
        ></iframe>
        
        <div className="botones-mapa">
          <Link to="/" className="mapa-button">Volver al Inicio</Link>
          <a
            href="https://www.metrocali.gov.co/red-de-servicio/"
            className="mapa-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver Estaciones y Horarios del MIO
          </a>
        </div>
      </div>
    </div>
  );
}

export default MapaCali;
