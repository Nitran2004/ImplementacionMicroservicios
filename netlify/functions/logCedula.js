export default async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const body = await req.text();
    let data = {};
    try {
      data = body ? JSON.parse(body) : {};
    } catch {
      data = {};
    }

    const cedula = data?.cedula;

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

    await client.query("INSERT INTO public.consultas (cedula) VALUES ($1)", [cedula]);

    let info = null;
    if (process.env.DEBUG_DB === "1") {
      const r = await client.query(`
        SELECT
          current_database() AS db,
          current_schema() AS schema,
          inet_server_addr()::text AS server_addr,
          inet_server_port() AS server_port,
          to_regclass('public.consultas') AS existe;
      `);
      info = r.rows[0];
    }

    await client.end();

    return new Response(JSON.stringify({ ok: true, info }), {
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
