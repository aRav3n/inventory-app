const { Pool } = require("pg");
require("dotenv").config();

module.exports = new Pool({
  connectionString: process.env.DATABASE_URL,
  /*
  host: "localhost",
  user: process.env.ROLE_NAME,
  database: "packing_list_app",
  password: process.env.ROLE_PASSWORD,
  port: 5432,
  */
});
