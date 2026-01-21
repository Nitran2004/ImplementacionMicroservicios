const BASE = process.env.REACT_APP_MS1_URL;

export const microservicio1 = async (ruc) => {
  if (!BASE) {
    throw new Error("REACT_APP_MS1_URL no está configurada");
  }

  const res = await fetch(`${BASE}/validaRuc/${ruc}`);

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`microservicio1 fallo (${res.status}) ${text}`);
  }

  return await res.json();
};
