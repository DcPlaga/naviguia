import React from 'react';

function BotonesModoOscuroVolver({ modoOscuro, setModoOscuro, bloquearEventos }) {
  // Función para hablar usando síntesis de voz
  const hablar = (texto) => {
    if (bloquearEventos) return; // No habla si se está esperando navegación
    const mensaje = new SpeechSynthesisUtterance(texto);
    mensaje.lang = "es-ES";
    speechSynthesis.cancel(); // Detiene cualquier mensaje anterior
    speechSynthesis.speak(mensaje);
  };

  const manejarFocoVolver = () => {
    hablar("Botón para volver a la página principal.");
  };

  const manejarClickVolver = () => {
    if (bloquearEventos) return;
    hablar("Has regresado a la página principal");
    window.location.href = "/";
  };

  return (
    <div className="botones-contenedor">
      <button
        type="button"
        className="btn-tema-secundario"
        onClick={() => setModoOscuro(!modoOscuro)}
        aria-pressed={modoOscuro}
        aria-label={modoOscuro ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      >
        {modoOscuro ? 'Modo claro' : 'Modo oscuro'}
      </button>
      <button
        type="button"
        className="btn-volver-secundario"
        onFocus={manejarFocoVolver}
        onTouchStart={manejarFocoVolver}
        onMouseEnter={manejarFocoVolver}
        onClick={manejarClickVolver}
        aria-label="Volver al inicio"
      >
        Volver al inicio
      </button>
    </div>
  );
}

export default BotonesModoOscuroVolver;
