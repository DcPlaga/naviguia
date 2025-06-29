import React from 'react';

function BotonesModoOscuroPerfil({ modoOscuro, setModoOscuro, bloquearEventos, reconocimientoActivo }) {
  const hablar = (texto, callback = null) => {
    if (bloquearEventos || reconocimientoActivo || window.speechSynthesis.speaking) return;

    const mensaje = new SpeechSynthesisUtterance(texto);
    mensaje.lang = "es-ES";
    speechSynthesis.cancel();
    speechSynthesis.speak(mensaje);

    if (callback) {
      mensaje.onend = () => callback();
    }
  };

  const manejarFocoVolver = () => {
    if (!bloquearEventos && !reconocimientoActivo) {
      hablar("Botón para volver a tu perfil");
    }
  };

  const manejarClickVolver = () => {
    if (window.speechSynthesis.speaking) {
      // Espera a que termine de hablar para redirigir
      const esperar = setInterval(() => {
        if (!window.speechSynthesis.speaking) {
          clearInterval(esperar);
          window.location.href = "/Perfil";
        }
      }, 300);
      return;
    }

    // Si no está hablando, habla y redirige al finalizar
    hablar("Has regresado a la página de tu perfil. Presiona el botón del centro para iniciar una nueva ruta.", () => {
      window.location.href = "/Perfil";
    });
  };

    return (
    <div className="barra-superior-ruta">
      <div className="lado-izquierdo">
        <button
          type="button"
          className="btn-modo-oscuro"
          onClick={() => {
            if (!reconocimientoActivo && !window.speechSynthesis.speaking) {
              setModoOscuro(!modoOscuro);
            }
          }}
          aria-pressed={modoOscuro}
          aria-label={modoOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {modoOscuro ? 'Modo Claro' : 'Modo Oscuro'}
        </button>
      </div>

      <h2 className="titulo-ruta">Mapa de Ruta</h2>

      <div className="lado-derecho">
        <button
          type="button"
          className="btn-volver-perfil"
          onFocus={manejarFocoVolver}
          onTouchStart={manejarFocoVolver}
          onMouseEnter={manejarFocoVolver}
          onClick={manejarClickVolver}
          aria-label="Volver al perfil"
        >
          Volver al perfil
        </button>
      </div>
    </div>
  );
}

export default BotonesModoOscuroPerfil;
