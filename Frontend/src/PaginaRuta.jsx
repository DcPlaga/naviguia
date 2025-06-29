import React, { useEffect, useState, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import BotonesModoOscuroPerfil from './components/BotonesRuta'; // Ajusta la ruta si es distinta
import L from 'leaflet';
import axios from 'axios';
import './styles/PaginaRuta.css';
import './stylesdark/PaginaRutadark.css';


const PaginaRuta = ({ correoUsuario }) => {
  // Estados
  const [ubicacion, setUbicacion] = useState(null);
  const [destino, setDestino] = useState(null);
  const [ruta, setRuta] = useState([]);
  const [mensajeError, setMensajeError] = useState("");
  const [paradasBus, setParadasBus] = useState([]);
  const [seguimientoActivo, setSeguimientoActivo] = useState(false);
  const [instruccionesNavegacion, setInstruccionesNavegacion] = useState([]);
  const [pasoActual, setPasoActual] = useState(0);
  const [distanciaTotal, setDistanciaTotal] = useState(0);
  const [tiempoEstimado, setTiempoEstimado] = useState(0);
  const [estadoConfirmacion, setEstadoConfirmacion] = useState(null);
  const haSaludadoRef = useRef(false);
  
  const [modoOscuro, setModoOscuro] = useState(false);
  const [bloquearEventos, setBloquearEventos] = useState(false);
  const [reconocimientoActivo, setReconocimientoActivo] = useState(false);
  const [hablando] = useState(false);

  // Refs
  const destinoTemporal = useRef("");
  const reconocimientoRef = useRef(null);
  const temporizadorRef = useRef(null);
  const intervaloUbicacionRef = useRef(null);
  const sintesisVozRef = useRef(null);
  const reiniciarAppRef = useRef(() => {});
  const recordatorioRef = useRef(null);

  // Constantes
  const ORS_KEY = process.env.REACT_APP_ORS_KEY;
  const TLAND_KEY = process.env.REACT_APP_TLAND_KEY;

  useEffect(() => {
    document.body.classList.toggle("dark", modoOscuro);
  }, [modoOscuro]);

  // Obtener recordatorios
  const detenerRecordatorio = useCallback(() => {
    if (recordatorioRef.current) {
      clearInterval(recordatorioRef.current);
      recordatorioRef.current = null;
    }
  }, []);

  const iniciarRecordatorio = useCallback(() => {
    detenerRecordatorio();
    recordatorioRef.current = setInterval(() => {
      if (window.speechSynthesis.speaking || reconocimientoActivo) return;

      const mensaje = new SpeechSynthesisUtterance(
        "¿Estás buscando una ruta? Presiona el micrófono y dinos tu destino."
      );
      window.speechSynthesis.speak(mensaje);
    }, 30000);
  }, [detenerRecordatorio, reconocimientoActivo]);

  
  // Obtener paradas de bus cercanas
  const obtenerParadasDeBus = useCallback(async ([lat, lon]) => {
    try {
      const response = await axios.get(
        `https://transit.land/api/v2/rest/stops`,
        {
          params: { lat, lon, r: 300 },
          headers: { Authorization: `apikey ${TLAND_KEY}` }
        }
      );
      setParadasBus(response.data.stops || []);
    } catch (error) {
      console.error("Error obteniendo paradas:", error);
    }
  }, [TLAND_KEY]);

  // Obtener nueva ruta para redibujar al moverse
  const obtenerRutaORS = useCallback(async (origen, destinoCoords) => {
    try {
      const response = await axios.post(
        `https://api.openrouteservice.org/v2/directions/foot-walking/geojson`,
        {
          coordinates: [[origen[1], origen[0]], [destinoCoords[1], destinoCoords[0]]]
        },
        {
          headers: {
            Authorization: ORS_KEY,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data.features[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
    } catch (error) {
      console.error("Error obteniendo ruta ORS:", error);
      return [];
    }
  }, [ORS_KEY]);

  // Seguimiento periódico de ubicación
  const iniciarSeguimientoUbicacion = useCallback(() => {
    if (intervaloUbicacionRef.current) clearInterval(intervaloUbicacionRef.current);
    intervaloUbicacionRef.current = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        async pos => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          setUbicacion(coords);
          if (destino && seguimientoActivo) {
            const nuevaRuta = await obtenerRutaORS(coords, destino);
            setRuta(nuevaRuta);
          }
        },
        err => console.error(err)
      );
    }, 5000);
  }, [destino, seguimientoActivo, obtenerRutaORS]);

  // Navegación por voz
  const iniciarNavegacionPorVoz = useCallback((instrucciones) => {
  if (!('speechSynthesis' in window)) {
    alert("Tu navegador no soporta guía por voz.");
    return;
  }

  if (sintesisVozRef.current) {
    window.speechSynthesis.cancel();
  }

  let paso = 0;
  const hablarInstruccion = () => {
    if (paso >= instrucciones.length) {
      const mensajeLlegada = new SpeechSynthesisUtterance(
        `Has llegado a tu destino. Recorrido total: ${Math.round(distanciaTotal)} metros.`
      );
      mensajeLlegada.onend = reiniciarAppRef.current;
      window.speechSynthesis.speak(mensajeLlegada);
      return;
    }
    const actual = instrucciones[paso];
    const mensaje = new SpeechSynthesisUtterance(
      `${actual.instruccion}. Distancia: ${Math.round(actual.distancia)} metros.`
    );
    sintesisVozRef.current = mensaje;
    window.speechSynthesis.speak(mensaje);
    mensaje.onend = () => {
      paso++;
      setPasoActual(paso);
      setTimeout(hablarInstruccion, 3000);
    };
  };
  hablarInstruccion();
}, [distanciaTotal]);

  // Calcular ruta + guardar + voz + seguimiento
  const calcularRutaYComienzarNavegacion = useCallback(async (origen, destinoCoords) => {
    try {
      const response = await axios.post(
        `https://api.openrouteservice.org/v2/directions/foot-walking/json`,
        {
          coordinates: [[origen[1], origen[0]], [destinoCoords[1], destinoCoords[0]]],
          instructions: true
        },
        {
          headers: {
            Authorization: ORS_KEY,
            'Content-Type': 'application/json'
          }
        }
      );

      const route = response.data.routes[0];
      const coords = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
      setRuta(coords);

      const pasos = route.segments[0].steps.map(step => ({
        distancia: step.distance,
        duracion: step.duration,
        instruccion: step.instruction
      }));
      setInstruccionesNavegacion(pasos);
      setDistanciaTotal(route.summary.distance);
      setTiempoEstimado(route.summary.duration);

      iniciarNavegacionPorVoz(pasos);
      setSeguimientoActivo(true);
      iniciarSeguimientoUbicacion();

      await axios.post('http://localhost:4000/api/guardarRuta', {
        usuarioCorreo: correoUsuario,
        origen: { lat: origen[0], lng: origen[1] },
        destino: { lat: destinoCoords[0], lng: destinoCoords[1] },
        distancia: route.summary.distance,
        duracion: route.summary.duration
      });
    } catch (error) {
      setMensajeError("No se pudo calcular la ruta.");
    }
  }, [ORS_KEY, correoUsuario, iniciarNavegacionPorVoz, iniciarSeguimientoUbicacion]);

  // Confirmar destino con búsqueda fuzzy
  const confirmarDestino = useCallback(async (nombreLugar) => {
    if (!ubicacion) {
      setMensajeError("Ubicación no disponible.");
      return;
    }

    try {
      const resp = await axios.get(
        `https://api.openrouteservice.org/geocode/search`,
        {
          params: {
            api_key: ORS_KEY,
            text: nombreLugar,
            'boundary.country': 'CO',
            size: 5
          }
        }
      );

      const features = resp.data.features;
      if (features.length === 0) {
        setMensajeError("No se encontró ese destino.");
        return;
      }

      const mejor = features.reduce((mej, actual) => {
        const [lon, lat] = actual.geometry.coordinates;
        const d = Math.hypot(lat - ubicacion[0], lon - ubicacion[1]);
        return !mej || d < mej.distancia
          ? { coords: [lat, lon], distancia: d }
          : mej;
      }, null);

      if (mejor) {
        setDestino(mejor.coords);
        calcularRutaYComienzarNavegacion(ubicacion, mejor.coords);
      }
    } catch (error) {
      console.error(error);
      setMensajeError("No se pudo encontrar la ubicación del destino.");
    }
  }, [ORS_KEY, ubicacion, calcularRutaYComienzarNavegacion]);

  // Iniciar reconocimiento de voz
 // En lugar de iniciar el reconocimiento inmediatamente,
// espera a que termine de hablar

const iniciarReconocimiento = useCallback(() => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Tu navegador no soporta reconocimiento de voz.");
    return;
  }

  if (temporizadorRef.current) clearTimeout(temporizadorRef.current);

  window.speechSynthesis.cancel();
  setEstadoConfirmacion(null);
  setMensajeError("");

  const reconocimiento = new SpeechRecognition();
    reconocimiento.lang = 'es-ES';
    reconocimiento.interimResults = false;
    reconocimiento.maxAlternatives = 1;
    reconocimientoRef.current = reconocimiento;

    const instruccion = new SpeechSynthesisUtterance(
      "¿Estás buscando una ruta? Dinos tu destino ahora."
    );
    instruccion.lang = "es-ES";

    instruccion.onend = () => {
      // Espera un poco tras terminar de hablar antes de activar el reconocimiento
      setTimeout(() => {
        setReconocimientoActivo(true);
        reconocimiento.start();

        // Si no se reconoce nada en 7 segundos, detener y hablar de nuevo
        temporizadorRef.current = setTimeout(() => {
          reconocimiento.stop();
          setReconocimientoActivo(false);

          const repetir = new SpeechSynthesisUtterance(
            "No te escuché. Intenta decir tu destino nuevamente, presionando el micrófono."
          );
          window.speechSynthesis.speak(repetir);
        }, 7000);
      }, 800); // 800ms de espera tras hablar
    };

    window.speechSynthesis.speak(instruccion);

    reconocimiento.onresult = (event) => {
      clearTimeout(temporizadorRef.current);
      const texto = event.results[0][0].transcript.toLowerCase();

      if (texto.includes("ayuda")) {
        window.speechSynthesis.cancel();
        const ayuda = new SpeechSynthesisUtterance(
          "Para comenzar, otorga los permisos necesarios para activar el micrófono a través de VoiceOver o TalkBack. Luego presiona el botón del micrófono en la parte inferior de la aplicación y di el nombre del destino. Cuando se escuche el destino, da dos toques para confirmar o uno para cancelar."
        );
        window.speechSynthesis.speak(ayuda);
        setReconocimientoActivo(false);
        return;
      }

      destinoTemporal.current = texto;
      setEstadoConfirmacion('esperando');

      const mensajeConfirmacion = new SpeechSynthesisUtterance(
        `¿Confirmas el destino ${texto}? Da dos toques para confirmar, o uno para cancelar.`
      );
      window.speechSynthesis.speak(mensajeConfirmacion);
      setReconocimientoActivo(false);
    };

    reconocimiento.onerror = () => {
      setMensajeError("No se entendió. Intenta de nuevo.");
      setReconocimientoActivo(false);
    };

    reconocimiento.onend = () => {
      if (!speechSynthesis.speaking) {
        setReconocimientoActivo(false);
      }
    };
  }, []);

  // Función para reiniciar la aplicación
  const reiniciarApp = useCallback(() => {
    setDestino(null);
    setRuta([]);
    setInstruccionesNavegacion([]);
    setPasoActual(0);
    setDistanciaTotal(0);
    setTiempoEstimado(0);
    setSeguimientoActivo(false);
    setEstadoConfirmacion(null);
    destinoTemporal.current = "";
    window.speechSynthesis.cancel();
    iniciarReconocimiento();
  }, [iniciarReconocimiento]);

// Asignar función a la ref
reiniciarAppRef.current = reiniciarApp;


  // Manejar doble toque para confirmación
  const manejarToquesConfirmacion = useCallback(() => {
    let toques = 0;
    const tiempoEspera = 1000;

    const handler = () => {
      toques++;
      clearTimeout(temporizadorRef.current);
      temporizadorRef.current = setTimeout(() => {
        if (toques === 2) {
          confirmarDestino(destinoTemporal.current);
          setEstadoConfirmacion('confirmado');
          window.speechSynthesis.cancel();
          const mensajeConfirmado = new SpeechSynthesisUtterance(
            `Destino confirmado. Iniciando la ruta hacia ${destinoTemporal.current}.`
          );
          window.speechSynthesis.speak(mensajeConfirmado);
          detenerRecordatorio();
        } else {
          setDestino(null);
          destinoTemporal.current = "";
          setEstadoConfirmacion('cancelado');
          window.speechSynthesis.cancel();
          const mensajeCancelado = new SpeechSynthesisUtterance(
            "Has cancelado el destino. Presiona el micrófono nuevamente para ingresar un destino nuevo."
          );
          window.speechSynthesis.speak(mensajeCancelado);
          iniciarRecordatorio(); 
        }
        toques = 0;
      }, tiempoEspera);
    };

    document.addEventListener('touchstart', handler);
    document.addEventListener('dblclick', handler); 
    return () => {
      document.removeEventListener('touchstart', handler);
      document.removeEventListener('dblclick', handler); 
    };

  }, [confirmarDestino, detenerRecordatorio, iniciarRecordatorio]);

  // Click en mapa manual
  const ClickMapa = () => {
    useMapEvents({
      click(e) {
        setDestino([e.latlng.lat, e.latlng.lng]);
        setMensajeError("");
      }
    });
    return null;
  };

  // Efectos

  useEffect(() => {
    if (hablando || reconocimientoActivo) {
      setBloquearEventos(true);
    } else {
      setBloquearEventos(false);
    }
  }, [hablando, reconocimientoActivo]);

  useEffect(() => {
    if (estadoConfirmacion === 'esperando') {
      const cleanup = manejarToquesConfirmacion();
      return cleanup;
    }
  }, [estadoConfirmacion, manejarToquesConfirmacion]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setUbicacion(coords);
        await obtenerParadasDeBus(coords);

        if (!haSaludadoRef.current) {
          const bienvenida = new SpeechSynthesisUtterance(
            "¡Inicia la navegación! Presiona el micrófono que está en la parte inferior e ingresa tu destino por voz, o di la palabra ayuda para recibir instrucciones."
          );
          window.speechSynthesis.speak(bienvenida);
          haSaludadoRef.current = true; // ✅ solo una vez
        }

        iniciarRecordatorio();
      },
      () => alert("No se pudo obtener tu ubicación.")
    );

    return () => {
      clearInterval(intervaloUbicacionRef.current);
      detenerRecordatorio();
      window.speechSynthesis.cancel();
    };
  }, [obtenerParadasDeBus, iniciarRecordatorio, detenerRecordatorio]);

  // Render
  return (
    <div className={`pagina-ruta-wrapper ${modoOscuro ? 'modo-oscuro' : ''}`}>
      <div className="menu-ruta">
        <div className="campo-ruta">
          <label>IR DESDE</label>
          <input
            type="text"
            value="Tu ubicación"
            disabled
            aria-label="En la parte superior se encuentran los campos de ubicacion. Tu campo de origen que es tu ubicación actual y el campo de destino que será llenado automáticamente tras dictar por microfono.."
            tabIndex="0"
          />
        </div>
        <div className="campo-ruta">
          <label>DESTINO</label>
          <input
            type="text"
            value={destinoTemporal.current || ""}
            placeholder="Presiona el micrófono e indica el destino"
            readOnly
            aria-label="En la parte superior se encuentran los campos de ubicacion. Tu campo de origen que es tu ubicación actual y el campo de destino que será llenado automáticamente tras dictar por microfono.."
            tabIndex="0"
          />
        </div>
      </div>
      
      <div className="mapa-contenedor">
        <BotonesModoOscuroPerfil 
          modoOscuro={modoOscuro}
          setModoOscuro={setModoOscuro}
          bloquearEventos={bloquearEventos || hablando}
          reconocimientoActivo={reconocimientoActivo || hablando}
        />
        <div className="mapa-wrapper">
          {ubicacion && (
            <MapContainer center={ubicacion} zoom={15} className="mapa-container">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <ClickMapa />
              <Marker position={ubicacion} icon={L.icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/64/64113.png', iconSize: [30, 30] })} />
              {destino && <Marker position={destino} />}
              {ruta.length > 0 && <Polyline positions={ruta} color="blue" />}
              {paradasBus.map((stop, i) => (
                <Marker key={i} position={[stop.geometry.coordinates[1], stop.geometry.coordinates[0]]} icon={L.icon({
                  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2250/2250399.png',
                  iconSize: [20, 20]
                })} />
              ))}
            </MapContainer>
          )}
        </div>

        <div className="panel-navegacion">
          {instruccionesNavegacion.length > 0 && (
            <>
              <div className="instruccion-actual">
                {instruccionesNavegacion[pasoActual]?.instruccion || "Preparando ruta..."}
              </div>
              <div className="metricas-navegacion">
                <div className="metrica"><div className="metrica-valor">{Math.round(distanciaTotal)} m</div><div className="metrica-label">Distancia</div></div>
                <div className="metrica"><div className="metrica-valor">{Math.round(tiempoEstimado / 60)} min</div><div className="metrica-label">Tiempo</div></div>
                <div className="metrica"><div className="metrica-valor">{pasoActual + 1}/{instruccionesNavegacion.length}</div><div className="metrica-label">Pasos</div></div>
              </div>
              <button className="boton-parar" onClick={reiniciarApp}>Detener navegación</button>
            </>
          )}
        </div>

        <div className="contenedor-microfono">
          <button aria-label="Activar micrófono para decir el destino o pedir ayuda"
                  aria-describedby="instruccion-mic"
                  onClick={iniciarReconocimiento}
                  className="boton-microfono">
            <img src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png" alt="Ícono de micrófono"  className="icono-microfono" aria-hidden="true" />
          </button>
          <span id="instruccion-mic" hidden>
            Presiona este botón para activar el micrófono. Luego, di tu destino o la palabra "ayuda" para recibir instrucciones.
          </span>
        </div>

        {mensajeError && (
          <div className="mensaje-error" role="alert" aria-live="assertive">
            {mensajeError}
          </div>
        )}
        {estadoConfirmacion === 'esperando' && (
        <div className="confirmacion-overlay" role="alert" aria-live="assertive">
          <p>¿Destino "{destinoTemporal.current}"?</p>
          <p><strong>Da dos toques para confirmar</strong> o uno para cancelar.</p>
        </div>
        )}
        {estadoConfirmacion === 'confirmado' && (
          <div className="confirmacion-exito" role="alert" aria-live="assertive">
            Destino confirmado
          </div>
        )}
        {estadoConfirmacion === 'cancelado' && (
          <div className="confirmacion-cancelado" role="alert" aria-live="assertive">
            Destino cancelado
          </div>
        )}
      </div>
    </div>
  );
};

export default PaginaRuta;