export default async (req, context) => {
  try {
    if (req.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const { cedula } = await req.json();

    if (!cedula) {
      return new Response(JSON.stringify({ ok: false, error: "cedula requerida" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const connStr =
      process.env.NETLIFY_DATABASE_URL || process.env.NETLIFY_DATABASE_URL_UNPOOLED;

    if (!connStr) {
      return new Response(
        JSON.stringify({ ok: false, error: "NETLIFY_DATABASE_URL no configurada" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { Client } = await import("pg");
    const client = new Client({
      connectionString: connStr,
      ssl: { rejectUnauthorized: false },
    });

    await client.connect();

    const info = await client.query(`
      SELECT current_database() AS db,
             current_schema() AS schema;
    `);

    await client.end();

    return new Response(JSON.stringify({ ok: true, info: info.rows[0] }), {
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
