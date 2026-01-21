export default async (req, context) => {
  try {
    const connStr =
      process.env.NETLIFY_DATABASE_URL || process.env.NETLIFY_DATABASE_URL_UNPOOLED;

    const { Client } = await import("pg");
    const client = new Client({
      connectionString: connStr,
      ssl: { rejectUnauthorized: false },
    });

    await client.connect();

    const r = await client.query(`
      SELECT
        current_database() AS db,
        current_schema() AS schema,
        inet_server_addr()::text AS server_addr,
        inet_server_port() AS server_port,
        to_regclass('public.consultas') AS existe;
    `);

    await client.end();

    return new Response(JSON.stringify({ ok: true, info: r.rows[0] }), {
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
