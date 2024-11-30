const { Client } = require("pg");
const dbQueries = require("./queries");
require("dotenv").config();

const dbName = "packing_list_app";

const SQL_TABLES = `
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  category_name VARCHAR (255) UNIQUE
);

CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  name VARCHAR (255),
  description VARCHAR (255),
  url VARCHAR (512),
  price FLOAT,
  weight_grams FLOAT
);

CREATE TABLE IF NOT EXISTS packing_list (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES categories(id),
  item_id INTEGER REFERENCES items(id),
  qty INTEGER,
  worn BOOLEAN
);
`;

const categories = [
  "Accessories",
  "Electronics",
  "Toiletries",
  "Clothing",
  "Bag",
  "Worn Items",
];

const items = [
  dbQueries.itemInsertValueString(
    "Water Bottle",
    "Klean Kanteen 40oz",
    "https://www.kleankanteen.com/products/water-bottle-wide-mouth-40-oz#",
    "",
    260
  ),
  dbQueries.itemInsertValueString(
    "Playing Cards",
    "Air Deck",
    "https://www.amazon.com/gp/product/B083FHMP44",
    "",
    72
  ),
  dbQueries.itemInsertValueString(
    "Laptop",
    "MacBook Air M1",
    "https://www.apple.com/macbook-air/",
    "",
    1288
  ),
  dbQueries.itemInsertValueString(
    "Wall Charger",
    "AOHI 40W",
    "https://iaohi.com/products/aohi-magcube-40w-foldable-dual-port-pd-charger-yellow",
    "",
    66
  ),
  dbQueries.itemInsertValueString(
    "Toiletry Bag",
    "Sea to Summit hanging small",
    "https://www.rei.com/product/218322/sea-to-summit-hanging-toiletry-bag-small?color=ATOLL%20BLUE",
    "",
    80
  ),
  dbQueries.itemInsertValueString(
    "Toothbrush",
    "generic bamboo one",
    "",
    "",
    10
  ),
  dbQueries.itemInsertValueString(
    "T-Shirt",
    "Cotton or Cotton-Poly Blend",
    "",
    "",
    150
  ),
  dbQueries.itemInsertValueString(
    "Sandals",
    "Bedrock Cairn Evo Pro Men's 9",
    "",
    "",
    425
  ),
];

const packingList = [
  {
    category: "Accessories",
    name: "Water Bottle",
    description: "Klean Kanteen 40oz",
    qty: 1,
    worn: false,
  },
  {
    category: "Accessories",
    name: "Playing Cards",
    description: "Air Deck",
    qty: 1,
    worn: false,
  },
  {
    category: "Electronics",
    name: "Laptop",
    description: "MacBook Air M1",
    qty: 1,
    worn: false,
  },
  {
    category: "Electronics",
    name: "Wall Charger",
    description: "AOHI 40W",
    qty: 1,
    worn: false,
  },
  {
    category: "Toiletries",
    name: "Toiletry Bag",
    description: "Sea to Summit hanging small",
    qty: 1,
    worn: false,
  },
  {
    category: "Toiletries",
    name: "Toothbrush",
    description: "generic bamboo one",
    qty: 1,
    worn: false,
  },
  {
    category: "Clothing",
    name: "T-Shirt",
    description: "Cotton or Cotton-Poly Blend",
    qty: 1,
    worn: true,
  },
  {
    category: "Clothing",
    name: "Sandals",
    description: "Bedrock Cairn Evo Pro Men's 9",
    qty: 1,
    worn: false,
  },
];

async function main() {
  console.log("Starting database setup...");

  const roleName = process.env.ROLE_NAME;
  const rolePassword = process.env.ROLE_PASSWORD;
  const client = new Client({
    connectionString: `postgresql://${roleName}:${rolePassword}@localhost:5432/${dbName}`,
  });

  try {
    await client.connect();

    console.log("Creating tables...");
    await client.query(SQL_TABLES);

    console.log("Inserting categories...");
    for (const category of categories) {
      await client.query(
        "INSERT INTO categories (category_name) VALUES ($1) ON CONFLICT (category_name) DO NOTHING",
        [category]
      );
    }

    console.log("Inserting items...");
    for (const item of items) {
      await client.query(item.query, item.values);
    }

    console.log("Inserting packing list...");
    for (const entry of packingList) {
      const itemIdResult = await client.query(
        "SELECT id FROM items WHERE name LIKE $1 AND description LIKE $2",
        [entry.name, entry.description]
      );

      const categoryIdResult = await client.query(
        "SELECT id FROM categories WHERE category_name LIKE $1",
        [entry.category]
      );

      if (itemIdResult.rows.length > 0 && categoryIdResult.rows.length > 0) {
        const itemId = itemIdResult.rows[0].id;
        const categoryId = categoryIdResult.rows[0].id;
        await client.query(
          "INSERT INTO packing_list (category_id, item_id, qty, worn) VALUES ($1, $2, $3, $4)",
          [categoryId, itemId, entry.qty, entry.worn]
        );
      }
    }

    console.log("Database setup complete!");
  } catch (err) {
    console.error("Error during database setup:", err);
  } finally {
    await client.end();
  }
}

main();
