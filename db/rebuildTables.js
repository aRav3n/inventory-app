const dropOldTables = require("./dropTables");
const makeNewTables = require("./buildAndPopulateTables");

async function main() {
  await dropOldTables();

  console.log("Starting makeNewTables...");
  await makeNewTables();
  console.log("makeNewTables complete...");
}

main();
