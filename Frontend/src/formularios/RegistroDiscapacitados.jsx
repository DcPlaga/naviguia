import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import BotonesModoOscuroVolver from '../components/BotonesModoOscuroVolver';
import { verificarCorreo } from '../utils/verificarCorreo';
import '../styles/light.css';
import '../stylesdark/dark.css';

function FormularioDiscapacitados() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    password: ''
  });

  const [modoOscuro, setModoOscuro] = useState(false);
  const [correoExistente, setCorreoExistente] = useState(false);
  const [validandoCorreo, setValidandoCorreo] = useState(false);
  const [pasoActual, setPasoActual] = useState(0);
  const [reconocimientoActivo, setReconocimientoActivo] = useState(false);
  const [mensajeEnviado, setMensajeEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [bloquearEventos, setBloquearEventos] = useState(false);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  const pasoActualRef = useRef(pasoActual);
  const nombreRef = useRef(null);
  const apellidoRef = useRef(null);
  const correoRef = useRef(null);
  const passwordRef = useRef(null);
  const resultadoVozRef = useRef('');

  const pasos = ['nombre', 'apellido', 'correo', 'password', 'registrar'];

  const instrucciones = {
    nombre: 'Gracias por preferir nuestra aplicacion, esperamos poder ayudarte al maximo. Para iniciar con el registro de tu cuenta. Por favor, indicanos tu nombre',
    apellido: 'Ahora por favor, di tu apellido.',
    correo: 'Ahora indica tu correo electrónico.',
    password: 'Ahora indica tu contraseña. Debe tener al menos 6 caracteres.',
    registrar: 'Registrando tu información.'
  };

  const referencias = {
    nombre: nombreRef,
    apellido: apellidoRef,
    correo: correoRef,
    password: passwordRef
  };

  const tiemposPorPaso = {
    nombre: 5000,
    apellido: 5000,
    correo: 12000,
    password: 8000
  };

  useEffect(() => {
    document.body.classList.toggle('dark', modoOscuro);

    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = 'es-ES';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const resultado = event.results?.[0]?.[0]?.transcript.trim().toLowerCase();
        resultadoVozRef.current = resultado;
        if (resultado) {
          manejarResultado(resultado);
        }
      };

      recognition.onend = () => {
        const resultado = resultadoVozRef.current;
        if (!resultado) {
          const paso = pasos[pasoActualRef.current];
          const campo = paso === 'password' ? 'contraseña' : paso;
          hablar(`No se escuchó. Por favor, dinos tu ${campo}.`);
        } else {
          resultadoVozRef.current = ''; // Limpieza
        }
      };

      recognition.onerror = (event) => {
        hablar('Tal vez no se te escuchó o tu mensaje no es valido. Por favor, intentalo de nuevo.');
        console.error('Reconocimiento error:', event.error);
      };

      recognitionRef.current = recognition;
    }

    setReconocimientoActivo(true);
    iniciarPaso(0);
    // eslint-disable-next-line
  }, [modoOscuro]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.correo) {
        verificarCorreo(formData.correo, setCorreoExistente, setValidandoCorreo);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [formData.correo]);

  useEffect(() => {
    pasoActualRef.current = pasoActual;
  }, [pasoActual]);

  const hablar = (texto, callback = null, autoReconocer = true) => {
    setReconocimientoActivo(false);
    setBloquearEventos(true); // ⛔ Bloquea eventos

    recognitionRef.current?.abort();

    const msg = new SpeechSynthesisUtterance(texto);
    msg.lang = 'es-ES';
    msg.onend = () => {
      setBloquearEventos(false); // ✅ Desbloquea al terminar
      if (callback) callback();
      if (autoReconocer) {
        setTimeout(() => iniciarReconocimiento(), 350);
      }
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(msg);
  };

  const iniciarPaso = (index) => {
    setPasoActual(index);
    const paso = pasos[index];
    const ref = referencias[paso];
    if (ref?.current) ref.current.focus();

    setTimeout(() => {
      hablar(instrucciones[paso]);
    }, 400);
  };

  const avanzarPaso = () => {
    setPasoActual(prevPaso => {
      const siguiente = Math.min(prevPaso + 1, pasos.length - 1);

      if (pasos[siguiente] === 'registrar') {
        setPasoActual(siguiente);
        recognitionRef.current?.abort(); // Cancela reconocimiento
        hablar(instrucciones.registrar, () => {
          // Espera un poco después de hablar y luego envía el formulario
          setTimeout(manejarEnvioFormulario, 1000);
        }, false);
      } else {
        setTimeout(() => iniciarPaso(siguiente), 250);
      }

      return siguiente;
    });
  };

  useEffect(() => {
    if (
      formData.nombre &&
      formData.apellido &&
      formData.correo &&
      formData.password.length >= 6 &&
      !correoExistente &&
      pasoActual === pasos.length - 1 &&
      !mensajeEnviado
    ) {
      manejarEnvioFormulario();
    } // eslint-disable-next-line
  }, [formData, correoExistente, pasoActual]);

  const reproducirBeep = () => {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const o = context.createOscillator();
    const g = context.createGain();

    o.type = 'sine';
    o.frequency.value = 1000;

    o.connect(g);
    g.connect(context.destination);

    o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.1);

    o.stop(context.currentTime + 0.1); // Detiene correctamente
  };

  let timeoutReconocimiento;

  const iniciarReconocimiento = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.abort();
      resultadoVozRef.current = '';
      recognitionRef.current.start();
      setReconocimientoActivo(true);

      const paso = pasos[pasoActualRef.current];
      const duracion = tiemposPorPaso[paso] || 7000;

      clearTimeout(timeoutReconocimiento);
      timeoutReconocimiento = setTimeout(() => {
        recognitionRef.current?.stop();
        setReconocimientoActivo(false);
        reproducirBeep();
      }, duracion);

    } catch (error) {
      console.error('Error iniciando reconocimiento:', error);
      hablar('Hubo un error iniciando el micrófono.');
    }
  };

  const formatearNombre = (texto) => {
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/(^\w{1})|(\s+\w{1})/g, letra => letra.toUpperCase());
  };

  const manejarResultado = (resultado) => {
    const paso = pasos[pasoActualRef.current];
    switch (paso) {
      case 'nombre':
      case 'apellido':
        setFormData(prev => ({ ...prev, [paso]: formatearNombre(resultado) }));
        avanzarPaso();
        break;

      case 'correo': {
        let correo = resultado
          .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .replace(/\s+/g, '')
          .replace(/arroba/g, '@')
          .replace(/punto/g, '.')
          .replace(/guionbajo|guion bajo/g, '_')
          .replace(/guion/g, '-');

        const tieneArroba = correo.includes('@');
        const tienePunto = correo.includes('.');
        const terminaConDominio = /\.(com|co|org|edu|net|gov|io|es)$/.test(correo);

        if (tieneArroba && tienePunto && terminaConDominio) {
          verificarCorreo(correo, (existe) => {
            if (existe) {
              setCorreoExistente(true);
              hablar('Este correo ya está registrado. Por favor, di un correo diferente.', () => iniciarPaso(pasoActualRef.current));
            } else {
              setCorreoExistente(false);
              setFormData(prev => ({ ...prev, correo }));
              avanzarPaso();
            }
          }, setValidandoCorreo);
        } else {
          hablar('Ese correo no parece válido. Inténtalo de nuevo.', () => iniciarPaso(pasoActualRef.current));
        }
        break;
      }

      case 'password':
        if (resultado.length < 6) {
          hablar('La contraseña debe tener al menos 6 caracteres. Por favor, di tu contraseña nuevamente.', () => iniciarPaso(pasoActualRef.current));
        } else {
          setFormData(prev => ({
            ...prev,
            password: resultado,
          }));
          avanzarPaso();
        }
        break;

      default:
        break;
    }
  };

  const manejarEnvioFormulario = async () => {
    if (correoExistente) return hablar('Este correo ya está registrado.', () => iniciarPaso(2));
    if (formData.password.length < 6) return hablar('La contraseña debe tener al menos 6 caracteres.', () => iniciarPaso(3));

    try {
      setCargando(true);
      const res = await fetch('http://localhost:4000/api/RegistroDiscapacitados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setMensajeEnviado(true);
        hablar('¡Registro exitoso! Serás redirigido al inicio de sesión.', () => navigate('/login'), false);
      } else {
        const err = await res.json();
        hablar(`Error al registrar: ${err.message || 'Intenta más tarde'}`);
      }
    } catch (err) {
      console.error(err);
      hablar('Ocurrió un error al conectar con el servidor. Intenta más tarde.');
    } finally {
      setCargando(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <BotonesModoOscuroVolver
        modoOscuro={modoOscuro}
        setModoOscuro={setModoOscuro}
        bloquearEventos={bloquearEventos}
        reconocimientoActivo={reconocimientoActivo}
      />
      <div className="contenedor-microfono">
        <button
          aria-label="Activar micrófono para dictar información"
          aria-describedby="instruccion-mic"
          onClick={iniciarReconocimiento}
          disabled={cargando}
          className={`boton-microfono ${reconocimientoActivo ? 'activo' : ''}`}>
          <img
            src={reconocimientoActivo
              ? "https://cdn-icons-png.flaticon.com/512/4712/4712035.png"
              : "https://cdn-icons-png.flaticon.com/512/4712/4712109.png"}
            alt={reconocimientoActivo ? "Micrófono activo" : "Micrófono inactivo"}
            className="icono-microfono"
            aria-hidden="true"
          />
        </button>
        <span id="instruccion-mic" hidden>
          Presiona este botón para activar el micrófono. Luego, sigue las instrucciones habladas.
        </span>
        {cargando && <div className="cargando-voz">Procesando...</div>}
      </div>

      <div className="registro-container">
        <form onSubmit={e => e.preventDefault()}>
          <h2>Formulario de Registro</h2>

          <label htmlFor="nombre">Nombre</label>
          <input ref={nombreRef} type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />

          <label htmlFor="apellido">Apellido</label>
          <input ref={apellidoRef} type="text" id="apellido" name="apellido" value={formData.apellido} onChange={handleChange} required />

          <label htmlFor="correo">Correo electrónico:
            {correoExistente && <span className="correo-registrado"> * Este correo ya está registrado</span>}
            {validandoCorreo && <span className="validando-correo"></span>}
          </label>
          <input ref={correoRef} type="email" id="correo" name="correo" value={formData.correo} onChange={handleChange} required />

          <label htmlFor="password">Contraseña (mínimo 6 caracteres)</label>
          <input ref={passwordRef} type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />

          <div className="botones-envio">
            <button type="button" className="btn-enviar" onClick={manejarEnvioFormulario} disabled={cargando}>
              {cargando ? 'Procesando...' : 'Registrarse'}
            </button>
            <div className="texto-cuenta">
              ¿Ya tienes una cuenta?{' '}
              <button type="button" className="btn-iniciar-sesion" onClick={() => navigate('/login')} disabled={cargando}>
                Inicia sesión
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default FormularioDiscapacitados;
