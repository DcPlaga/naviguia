import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Botonesinicio from './components/BotonesInicio';
import './styles/inicio.css';
import './stylesdark/iniciodark.css';

function InicioRegistro() {
  const [modoOscuro, setModoOscuro] = useState(false);
  const [esperandoNavegacion, setEsperandoNavegacion] = useState(null);
  const [bloquearEventos, setBloquearEventos] = useState(false);
  const navigate = useNavigate();

  // Cambia tema
  useEffect(() => {
    document.body.classList.toggle('dark', modoOscuro);
  }, [modoOscuro]);

  // Bloquea clic derecho en imágenes
  useEffect(() => {
    const handleContextMenu = (e) => {
      if (e.target.tagName === 'IMG') e.preventDefault();
    };
    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  // Mensaje de bienvenida con voz
  useEffect(() => {
    const mensajeBienvenida =
      "Bienvenido o Bienvenida. Si eres un usuario con discapacidad visual, presiona el primer formulario e inicia tu experiencia con Navi Guía. ¡Esperamos poder guiarte para que tomes un transporte público más accesible y seguro!";
    const utterance = new SpeechSynthesisUtterance(mensajeBienvenida);
    utterance.lang = "es-ES";
    speechSynthesis.speak(utterance);
  }, []);

  // Función para hablar con voz sintética
  const hablar = (texto, callback) => {
    // Solo cancela si no se está esperando una navegación
    if (!esperandoNavegacion) speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = "es-ES";
    if (callback) utterance.onend = callback;
    speechSynthesis.speak(utterance);
  };

  // Hover, foco o touch
  const manejarFocoOTacto = (titulo) => {
    if (bloquearEventos) return; // Previene que se dispare mientras habla después del clic

    if (titulo === "Discapacitados Visuales") {
      hablar("Este es el formulario para personas con discapacidad visual. Si eres un usuario con esta condición, aquí podrás registrarte y comenzar a usar NaviGuía. Presiona si deseas continuar.");
    } else {
      hablar(`Este es el formulario para ${titulo}.`);
    }
  };

  // Clic con navegación segura
  const manejarClick = (titulo, link) => {
    if (bloquearEventos) return;

    const mensaje =
      titulo === "Discapacitados Visuales"
        ? "Has presionado el formulario para personas con discapacidad visual. Te llevaremos al formulario de registro."
        : `Has presionado el formulario para ${titulo}.`;

    speechSynthesis.cancel(); // Cancela cualquier otra voz
    setEsperandoNavegacion(link);
    setBloquearEventos(true);

    const utterance = new SpeechSynthesisUtterance(mensaje);
    utterance.lang = "es-ES";

    utterance.onend = () => {
      setEsperandoNavegacion(null);
      setBloquearEventos(false);
      navigate(link);
    };

    // Navegación de respaldo si interrumpen el audio
    setTimeout(() => {
      if (esperandoNavegacion === link) {
        setEsperandoNavegacion(null);
        setBloquearEventos(false);
        navigate(link);
      }
    }, 4000); // Ajusta según duración estimada del mensaje

    speechSynthesis.speak(utterance);
  };

  // Datos de cada tarjeta de usuario
  const cardData = {
    discapacitados: {
      title: "Discapacitados Visuales",
      img: "/NaviGuiaAppD.jpeg",
      alt: "Usuario Discapacitado",
      description:
        "¡Nuestra App está desarrollada hacia personas con discapacidad visual para que puedan tomar rutas más accesibles, fáciles y seguras! Si eres un acompañante o alguien con experiencia en apoyo a personas con este tipo de discapacidad, tus sugerencias nos serán de gran ayuda para mejorar la calidad de vida de muchas personas. Contáctanos a través de nuestra aplicación o nuestras redes.",
      link: "/RegistroDiscapacitados",
    },
    acompanantes: {
      title: "Acompañantes",
      img: "/NaviGuiaAppA.jpeg",
      alt: "Acompañante",
      description:
        "¿Te gustaría hacer la diferencia en la vida de alguien? Regístrate como acompañante y brinda apoyo a personas con discapacidad visual en sus trayectos diarios. Cuéntanos sobre tu experiencia, tu zona de cobertura y tu disponibilidad. Tu compromiso puede abrir caminos, generar confianza y construir una comunidad más inclusiva.",
      link: "/RegistroAcompanantes",
    },
    conductores: {
      title: "Conductores",
      img: "/NaviGuiaAppC.jpeg",
      alt: "Conductor",
      description:
        "¿Eres conductor y quieres prestar tus servicios para generar impacto social? Regístrate como conductor y ayuda a que personas con discapacidad visual lleguen a sus destinos de forma rápida y segura. Adjunta tu licencia, placa, tipo de vehículo y SOAT. La responsabilidad y empatía son nuestro lema, la clave para prestar un servicio de calidad y transporte más humano e inclusivo.",
      link: "/RegistroConductores",
    },
  };

  return (
    <div className="home-container" role="main" aria-labelledby="titulo-registro">
      <header className="navbar" role="banner">
        <div className="navbar-left">
          <span role="img" aria-label="Logo de NaviGuía">🧭</span>
          <h1 className="app-title" id="titulo-registro">NaviGuía - Registro de Usuarios</h1>
        </div>
        <div className="navbar-right">
          <Botonesinicio
            modoOscuro={modoOscuro}
            setModoOscuro={setModoOscuro}
            bloquearEventos={bloquearEventos}
          />
        </div>
      </header>

      <div className="cards-container" role="region" aria-label="Opciones de registro">
        {Object.values(cardData).map((card, index) => (
          <div
            key={index}
            className="card-link"
            role="link"
            tabIndex={0}
            aria-label={`Ir al formulario de ${card.title}`}
            onFocus={() => manejarFocoOTacto(card.title)}
            onTouchStart={() => manejarFocoOTacto(card.title)}
            onMouseEnter={() => manejarFocoOTacto(card.title)}
            onClick={() => manejarClick(card.title, card.link)}
          >
            <div className="card" role="group" aria-labelledby={`card-title-${index}`}>
              <h2 id={`card-title-${index}`}>{card.title}</h2>
              <img src={card.img} alt={card.alt + '. Imagen ilustrativa.'} draggable="false" />
              <p>{card.description}</p>
              <span className="btn-card" aria-hidden="true">Ir al formulario</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InicioRegistro;
