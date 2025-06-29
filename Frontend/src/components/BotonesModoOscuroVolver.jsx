import React from 'react';

function BotonesModoOscuroVolver({ modoOscuro, setModoOscuro, bloquearEventos, reconocimientoActivo }) {
  // Función para hablar usando síntesis de voz
  const hablar = (texto) => {
    if (bloquearEventos || reconocimientoActivo) return; // Evita hablar si está bloqueado o escuchando
    const mensaje = new SpeechSynthesisUtterance(texto);
    mensaje.lang = "es-ES";
    speechSynthesis.cancel();
    speechSynthesis.speak(mensaje);
  };

  const manejarFocoVolver = () => {
    hablar("Botón para volver a la página principal.");
  };

  const manejarClickVolver = () => {
    if (bloquearEventos) return;
    hablar("Has regresado a la página principal");
    setTimeout(() => {
      window.location.href = "/";
    }, 500); // Da tiempo para que se escuche el mensaje antes de redirigir
  };

  return (
    <div className="botones-contenedor">
      <button
        type="button"
        className="btn-volver-inicio"
        onFocus={manejarFocoVolver}
        onTouchStart={manejarFocoVolver}
        onMouseEnter={manejarFocoVolver}
        onClick={manejarClickVolver}
        aria-label="Volver al inicio"
      >
        Volver al inicio
      </button>
      <button
        type="button"
        className="btn-modo-osc"
        onClick={() => setModoOscuro(!modoOscuro)}
        aria-pressed={modoOscuro}
        aria-label={modoOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      >
        {modoOscuro ? 'Modo claro' : 'Modo oscuro'}
      </button>
    </div>
  );
}

export default BotonesModoOscuroVolver;