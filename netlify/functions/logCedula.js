export default async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ ok: false, error: "Method Not Allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const cedula = String(body.cedula || "").trim();

    if (!cedula) {
      return new Response(JSON.stringify({ ok: false, error: "cedula requerida" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Obtén la URL de conexión
    const connStr = process.env.DATABASE_URL;

    if (!connStr) {
      console.error("DATABASE_URL no está configurada");
      return new Response(JSON.stringify({ ok: false, error: "DATABASE_URL no configurada" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Importa pg
    const { Client } = await import("pg");
    
    // Crea el cliente
    const client = new Client({
      connectionString: connStr,
      ssl: {
        rejectUnauthorized: false,
      },
    });

    // Conecta
    await client.connect();
    console.log("Conectado a PostgreSQL exitosamente");

    // Inserta la cédula
    const result = await client.query(
      "INSERT INTO public.consultas (cedula, fecha) VALUES ($1, NOW()) RETURNING id",
      [cedula]
    );

    await client.end();

    return new Response(JSON.stringify({ 
      ok: true, 
      message: "Cédula guardada correctamente",
      id: result.rows[0]?.id
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (e) {
    console.error("Error en logCedula:", e);
    return new Response(JSON.stringify({ 
      ok: false, 
      error: String(e?.message || e) 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};