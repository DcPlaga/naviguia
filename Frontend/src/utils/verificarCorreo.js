export const verificarCorreo = async (correo, setCorreoExistente, setValidandoCorreo) => {
  if (!correo) return;

  setValidandoCorreo(true);
  try {
    const response = await fetch(`http://localhost:4000/api/verificar-correo?correo=${encodeURIComponent(correo)}`);
    const data = await response.json();
    setCorreoExistente(data.existe);
  } catch (error) {
    console.error("Error al verificar el correo:", error);
  } finally {
    setValidandoCorreo(false);
  }
};
