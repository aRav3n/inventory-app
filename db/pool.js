const { Pool } = require("pg");

module.exports = new Pool({
  // connectionString: process.env.DATABASE_URL,
  host: "localhost",
  user: process.env.ROLE_NAME,
  database: "top_users",
  password: process.env.ROLE_PASSWORD,
  port: 5432,
});
