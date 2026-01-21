const BASE = process.env.REACT_APP_MS2_URL;

export const microservicio2 = async (cedula) => {
  if (!BASE) {
    throw new Error("REACT_APP_MS2_URL no está configurada");
  }

  const res = await fetch(`${BASE}/obtenerPuntaje/${cedula}`);

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`microservicio2 fallo (${res.status}) ${text}`);
  }

  return await res.json();
};
