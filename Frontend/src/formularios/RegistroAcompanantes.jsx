import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import BotonesModoOscuroVolver from '../components/BotonesModoOscuroVolver';
import { verificarCorreo } from '../utils/verificarCorreo';
import '../styles/light.css';
import '../stylesdark/dark.css';

function FormularioAcompanantes() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    zona: "",
    experiencia: "",
    horarios: "",
    password: "", 
    confirmPassword: "" 
  });

  const [correoExistente, setCorreoExistente] = useState(false);
  const [validandoCorreo, setValidandoCorreo] = useState(false);
  const [modoOscuro, setModoOscuro] = useState(false);
  const [mensajeEnviado, setMensajeEnviado] = useState(false);
  const passwordRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.toggle('dark', modoOscuro);
  }, [modoOscuro]);

  useEffect(() => {
    const timer = setTimeout(() => {
      verificarCorreo(formData.correo, setCorreoExistente, setValidandoCorreo); // ✅ CORRECTO
    }, 500);
    return () => clearTimeout(timer);
  }, [formData.correo]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (correoExistente) {
      alert('Este correo ya está registrado. Por favor usa otro.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden.');
      if (passwordRef.current) passwordRef.current.focus();
      return;
    }
    try {
      const response = await fetch('http://localhost:4000/api/RegistroAcompanantes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMensajeEnviado(true);

        setTimeout(() => {
          setMensajeEnviado(false);
          setFormData({
            nombre: "",
            apellido: "",
            correo: "",
            zona: "",
            experiencia: "",
            horarios: "",
            password: "",
            confirmPassword: ""
          });
          navigate('/login'); // 👈 Redirige al login después de 3 segundos
        }, 1000);
      } else {
        console.error("Error al registrar acompañante");
      }
    } catch (err) {
      console.error("Error en conexión:", err);
    }
  };

  return (
    <>
      <BotonesModoOscuroVolver modoOscuro={modoOscuro} setModoOscuro={setModoOscuro} />
      <div className="registro-container">
        <form onSubmit={handleSubmit}>
          <h2>Formulario de Registro</h2>

          <label>Nombre</label>
          <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />

          <label>Apellido</label>
          <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} required />

          <label htmlFor="correo">Correo electrónico: {correoExistente && (
            <span className ="correo-registrado">
              * Este correo ya está registrado
              </span>)}{validandoCorreo && (<span>
            </span>
          )}</label>
          <input
            type="email"
            id="correo"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Contraseña</label>
          <input ref={passwordRef} type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />

          <label htmlFor="confirmPassword">Confirmar contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword || ''}
            onChange={handleChange}
            required
          />

          <label>Zona de disponibilidad</label>
          <input type="text" name="zona" value={formData.zona} onChange={handleChange} required />

          <label>¿Tiene experiencia en acompañamiento para personas con discapacidad visual?</label>
          <select name="experiencia" value={formData.experiencia} onChange={handleChange} required>
            <option value="">Seleccione una opción</option>
            <option value="si">Sí</option>
            <option value="no">No</option>
          </select>

          <label>Horarios disponibles</label>
          <input type="text" name="horarios" value={formData.horarios} onChange={handleChange} required />

          <div className="botones-envio">
            <button type="submit" className="btn-enviar">
              Registrarse
            </button>
            <div className="texto-cuenta">
              ¿Ya tienes una cuenta?{' '}
              <button 
                type="button" 
                className="btn-iniciar-sesion"
                onClick={() => window.location.href = "/login"}
              > Inicia sesión
              </button>
            </div>
          </div>
          
          {mensajeEnviado && <span className="mensaje-exito"></span>}
        </form>
      </div>
    </>
  );
}

export default FormularioAcompanantes;