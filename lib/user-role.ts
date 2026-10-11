import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function getUserRole(userId: string) {
  const result = await pool.query<{ role: string }>('SELECT "role" FROM "user" WHERE "id" = $1 LIMIT 1', [userId])
  return result.rows[0]?.role ?? 'user'
}
