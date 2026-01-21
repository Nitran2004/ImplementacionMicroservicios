export default async (req) => {
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

    // esto evita que vuelva a fallar si la tabla no está en esa db
    await client.query(`
      create table if not exists public.consultas (
        id bigserial primary key,
        cedula text not null,
        fecha timestamptz not null default now()
      );
    `);

    await client.query("insert into public.consultas (cedula) values ($1)", [cedula]);

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
