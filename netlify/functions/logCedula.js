export default async (req, context) => {
  try {
    if (req.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
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

    const existe = await client.query(`SELECT to_regclass('public.consultas') AS existe;`);
    await client.end();

    return new Response(JSON.stringify({ ok: true, existe: existe.rows[0].existe }), {
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
