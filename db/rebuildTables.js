const dropOldTables = require("./dropTables");
const makeNewTables = require("./buildAndPopulateTables");
const pool = require("./pool");

async function main() {
  await dropOldTables();

  console.log("Starting makeNewTables...");
  await makeNewTables();
  console.log("makeNewTables complete...");
}

main();
