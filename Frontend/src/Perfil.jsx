import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Perfil.css';

function Perfil() {
  const navigate = useNavigate();

  // Simulando tipo de usuario (luego deberías traerlo desde el backend)
  const tipoUsuario = 'visual'; // Cambiar según login: 'visual', 'acompañante', 'conductor'

  const handleComenzarRuta = () => {
    navigate('/ruta'); // Página de Fabian
  };

  return (
    <div className="perfil-container">
      <h2>Bienvenido, Usuario</h2>
      <p>Tipo: {tipoUsuario}</p>
      <p>Última ruta: Terminal - Hospital (15 min)</p>

      <button className="btn-iniciar" onClick={handleComenzarRuta}>
        Comenzar Ruta
      </button>

      <div className="config-buttons">
        <button onClick={() => alert("Próximamente ajustes de accesibilidad")}>Ajustes</button>
        <button onClick={() => navigate('/login')}>Cerrar Sesión</button>
      </div>
    </div>
  );
}

export default Perfil;
