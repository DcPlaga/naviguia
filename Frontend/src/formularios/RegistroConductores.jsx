import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import BotonesModoOscuroVolver from '../components/BotonesModoOscuroVolver';
import { verificarCorreo } from '../utils/verificarCorreo';
import '../styles/light.css';
import '../stylesdark/dark.css';

function FormularioConductores() {
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    documento: "",
    licenciaArchivo: null,
    placa: "",
    tipoVehiculo: "",
    soat: "",
    revision: "",
    telefono: "",
    correo: "",
    zona: "",
    password: "",
    confirmPassword: ""
  });

  const [modoOscuro, setModoOscuro] = useState(false);
  const [mensajeEnviado, setMensajeEnviado] = useState(false);
  const [errorRevision, setErrorRevision] = useState("");
  const [correoExistente, setCorreoExistente] = useState(false);
  const [validandoCorreo, setValidandoCorreo] = useState(false);
  const [fechaMin, setFechaMin] = useState('');
  const [fechaMax, setFechaMax] = useState('');
  const passwordRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      verificarCorreo(formData.correo, setCorreoExistente, setValidandoCorreo);
    }, 500);
    return () => clearTimeout(timer);
  }, [formData.correo]);

  useEffect(() => {
    document.body.classList.toggle('dark', modoOscuro);

    const hoy = new Date();
    const manana = new Date();
    manana.setDate(hoy.getDate() + 1);

    const haceUnAno = new Date();
    haceUnAno.setFullYear(hoy.getFullYear() - 1);

    const formato = (fecha) => fecha.toISOString().split('T')[0];

    const min = formato(haceUnAno);
    const max = formato(manana);

    setFechaMin(min);
    setFechaMax(max);

    setFormData((prevData) => ({
      ...prevData,
      revision: max
    }));
  }, [modoOscuro]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
  };

  const manejarEnvioFormulario = async () => {
    if (correoExistente) {
      alert('Este correo ya está registrado. Por favor usa otro.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden.');
      passwordRef.current?.focus();
      return;
    }

    const fechaRevision = new Date(formData.revision);
    const fechaMinDate = new Date(fechaMin);
    const fechaMaxDate = new Date(fechaMax);

    if (fechaRevision < fechaMinDate || fechaRevision > fechaMaxDate) {
      setErrorRevision(`La fecha debe estar entre ${fechaMin} y ${fechaMax}.`);
      return;
    } else {
      setErrorRevision("");
    }

    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const response = await fetch('http://localhost:4000/api/RegistroConductores', {
        method: 'POST',
        body: data
      });

      if (response.ok) {
        setMensajeEnviado(true);
        setTimeout(() => {
          setMensajeEnviado(false);
          setFormData({
            nombreCompleto: "",
            documento: "",
            licenciaArchivo: null,
            placa: "",
            tipoVehiculo: "",
            soat: "",
            revision: "",
            telefono: "",
            correo: "",
            zona: "",
            password: "",
            confirmPassword: ""
          });
          navigate('/login'); 
        }, 1000);
      } else {
        alert("Error al registrar conductor.");
      }
    } catch (err) {
      console.error("Error en la conexión:", err);
      alert("Error en la conexión con el servidor.");
    }
  };

  return (
    <>
      <BotonesModoOscuroVolver modoOscuro={modoOscuro} setModoOscuro={setModoOscuro} />
      <div className="registro-container">
        <form onSubmit={(e) => e.preventDefault()}>
          <h2>Formulario de Registro</h2>

          <label>Nombre completo</label>
          <input type="text" name="nombreCompleto" value={formData.nombreCompleto} onChange={handleChange} required />

          <label>Documento de identidad</label>
          <input type="text" name="documento" value={formData.documento} onChange={handleChange} required />

          <label>Adjuntar licencia de conducción</label>
          <input type="file" name="licenciaArchivo" accept="application/pdf,image/*" onChange={handleChange} required />

          <label>Número de placa del vehículo</label>
          <input type="text" name="placa" value={formData.placa} onChange={handleChange} required />

          <label>Tipo de vehículo</label>
          <input type="text" name="tipoVehiculo" value={formData.tipoVehiculo} onChange={handleChange} required />

          <label>Seguro obligatorio (SOAT)</label>
          <input type="text" name="soat" value={formData.soat} onChange={handleChange} required />

          <label>Última fecha de revisión técnico-mecánica</label>
          <input
            type="date"
            name="revision"
            value={formData.revision}
            onChange={handleChange}
            required
            min={fechaMin}
            max={fechaMax}
          />
          {errorRevision && <p className="mensaje-error">{errorRevision}</p>}

          <label>Teléfono</label>
          <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} required />

          <label htmlFor="correo">
            Correo electrónico:
            {correoExistente && <span className="correo-registrado"> * Este correo ya está registrado</span>}
            {validandoCorreo && <span className="validando-correo"> Validando correo...</span>}
          </label>
          <input type="email" id="correo" name="correo" value={formData.correo} onChange={handleChange} required />

          <label>Contraseña</label>
          <input ref={passwordRef} type="password" name="password" value={formData.password} onChange={handleChange} required />

          <label>Confirmar contraseña</label>
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />

          <label>Zona de cobertura</label>
          <input type="text" name="zona" value={formData.zona} onChange={handleChange} required />

          <div className="botones-envio">
            <button type="button" className="btn-enviar" onClick={manejarEnvioFormulario}>
              Registrarse
            </button>
            <div className="texto-cuenta">
              ¿Ya tienes una cuenta?{' '}
              <button type="button" className="btn-iniciar-sesion" onClick={() => navigate('/login')}>
                Inicia sesión
              </button>
            </div>
          </div>
          {mensajeEnviado && <span className="mensaje-exito"></span>}
        </form>
      </div>
    </>
  );
}

export default FormularioConductores;
