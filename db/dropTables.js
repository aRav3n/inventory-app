const pool = require("./pool");
require("dotenv").config();

async function main() {
  try {
    console.log("Dropping old tables...");
    await pool.query(`DROP TABLE IF EXISTS categories CASCADE;`);
    await pool.query(`DROP TABLE IF EXISTS items CASCADE;`);
    await pool.query(`DROP TABLE IF EXISTS packing_list CASCADE;`);
    console.log("Table drops complete!");
  } catch (err) {
    console.error("Error during table drops:", err);
    throw err;
  }
}

async function exportFunction() {
  await main();
}

module.exports = exportFunction;
