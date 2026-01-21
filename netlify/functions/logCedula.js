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

    const connStr =
      process.env.NETLIFY_DATABASE_URL || process.env.NETLIFY_DATABASE_URL_UNPOOLED;

    if (!connStr) {
      return new Response(JSON.stringify({ ok: false, error: "NETLIFY_DATABASE_URL no configurada" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { Client } = await import("pg");
    const client = new Client({
      connectionString: connStr,
      ssl: { rejectUnauthorized: false },
    });

    await client.connect();

    // Inserta SIEMPRE (si tu tabla tiene UNIQUE en cedula, esto fallará; abajo te digo cómo arreglarlo)
    await client.query(
      "INSERT INTO public.consultas (cedula) VALUES ($1)",
      [cedula]
    );

    await client.end();

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e?.message || e) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
