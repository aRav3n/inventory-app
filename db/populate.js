const { Client } = require("pg");
const dbQueries = require("./queries");
require("dotenv").config();
const dbName = "packing_list_app";

const SQL = `
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  category_name VARCHAR ( 255 ),
);

CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  category_id FOREIGN KEY,
  name VARCHAR ( 255 ),
  description VARCHAR( 255 ),
  url VARCHAR ( 512 ),
  price FLOAT,
  weight_grams FLOAT,
);

CREATE TABLE IF NOT EXISTS packing_list (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  item_id FOREIGN KEY,
  qty INTEGER,
  worn BOOLEAN,
);

INSERT INTO categories (category_name)
VALUES
  ('Accessories'),
  ('Electronics'),
  ('Toiletries'),
  ('Clothing'),
  ('Bag'),
  ('Worn Items');

${dbQueries.accessoryInsertValue(
  "Water Bottle",
  "Klean Kanteen 40oz",
  "https://www.kleankanteen.com/products/water-bottle-wide-mouth-40-oz#",
  "",
  "260"
)}

${dbQueries.accessoryInsertValue(
  "Playing Cards",
  "Air Deck",
  "https://www.amazon.com/gp/product/B083FHMP44",
  "",
  "72"
)}

${dbQueries.electronicInsertValueString(
  "Laptop",
  "MacBook Air M1",
  "https://www.apple.com/macbook-air/",
  "",
  "1288"
)}

${dbQueries.electronicInsertValueString(
  "Wall Charger",
  "AOHI 40W",
  "https://iaohi.com/products/aohi-magcube-40w-foldable-dual-port-pd-charger-yellow",
  "",
  "66"
)}

${dbQueries.toiletryInsertValueString(
  "Toiletry Bag",
  "Sea to Summit hanging small",
  "https://www.rei.com/product/218322/sea-to-summit-hanging-toiletry-bag-small?color=ATOLL%20BLUE",
  "",
  "80"
)}

${dbQueries.toiletryInsertValueString(
  "Toothbrush",
  "generic bamboo one",
  "",
  "",
  "10"
)}

${dbQueries.clothingInsertValueString(
  "T-Shirt",
  "Cotton or Cotton-Poly Blend",
  "",
  "",
  "150"
)}

${dbQueries.clothingInsertValueString(
  "Sandals",
  "Bedrock Cairn Evo Pro Men's 9",
  "",
  "",
  "425"
)}

${dbQueries.insertIntoPackingList(
  "water Bottle",
  "Klean Kanteen 40oz",
  1,
  false
)}

${dbQueries.insertIntoPackingList("Playing Cards", "Air Deck", 1, false)}

${dbQueries.insertIntoPackingList("Laptop", "Macbook Air M1", 1, false)}

${dbQueries.insertIntoPackingList("Wall Charger", "AOHI 40W", 1, false)}

${dbQueries.insertIntoPackingList(
  "Toiletry Bag",
  "Sea to Summit hanging small",
  1,
  false
)}

${dbQueries.insertIntoPackingList("Toothbrush", "generic bamboo one", 1, false)}

${dbQueries.insertIntoPackingList(
  "T-Shirt",
  "Cotton or Cotton-Poly Blend",
  1,
  true
)}

${dbQueries.insertIntoPackingList(
  "Sandals",
  "Bedrock Cairn Evo Pro Men's 9",
  1,
  false
)}
`;

async function main() {
  console.log("seeding...");
  const roleName = process.env.ROLE_NAME;
  const rolePassword = process.env.ROLE_PASSWORD;
  const client = new Client({
    connectionString: `postgresql://${roleName}:${rolePassword}@localhost:5432/${dbName}`,
    // connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
