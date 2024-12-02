const pool = require("./pool");
const db = require("./queries");
require("dotenv").config();

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

function validateEnvVars() {
  const requiredVars = ["ROLE_NAME", "ROLE_PASSWORD"];
  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
  }
}

function buildItemObject(
  name,
  description,
  url,
  price = 0,
  weight = 0,
  category,
  qty = 0,
  worn = false
) {
  name?.trim(),
    description?.trim(),
    url,
    Number(price) || 0,
    Number(weight) || 0;

  const object = {
    name: name,
    description: description,
    url: url,
    price: price,
    weight: weight,
    category: category,
    qty: qty,
    worn: worn,
  };

  return object;
}

const packingList = [
  buildItemObject(
    "Water Bottle",
    "Klean Kanteen 40oz",
    "https://www.kleankanteen.com/products/water-bottle-wide-mouth-40-oz#",
    0,
    260,
    "Accessories",
    1,
    false
  ),
  buildItemObject(
    "Playing Cards",
    "Air Deck",
    "https://www.amazon.com/gp/product/B083FHMP44",
    0,
    72,
    "Accessories",
    1,
    false
  ),
  buildItemObject(
    "Laptop",
    "MacBook Air M1",
    "https://www.apple.com/macbook-air/",
    0,
    1288,
    "Electronics",
    1,
    false
  ),
  buildItemObject(
    "Wall Charger",
    "AOHI 40W",
    "https://iaohi.com/products/aohi-magcube-40w-foldable-dual-port-pd-charger-yellow",
    0,
    66,
    "Electronics",
    1,
    false
  ),
  buildItemObject(
    "Toiletry Bag",
    "Sea to Summit hanging small",
    "https://www.rei.com/product/218322/sea-to-summit-hanging-toiletry-bag-small?color=ATOLL%20BLUE",
    0,
    80,
    "Toiletries",
    1,
    false
  ),
  buildItemObject(
    "Toothbrush",
    "generic bamboo one",
    "",
    0,
    10,
    "Toiletries",
    1,
    false
  ),
  buildItemObject(
    "T-Shirt",
    "Cotton or Cotton-Poly Blend",
    "",
    0,
    150,
    "Clothing",
    1,
    false
  ),
  buildItemObject(
    "Sandals",
    "Bedrock Cairn Evo Pro Men's 9",
    "",
    0,
    425,
    "Clothing",
    1,
    false
  ),
];

async function main() {
  console.log("Starting table creation and population...");

  try {
    validateEnvVars();

    await pool.query(SQL_TABLES);
    console.log("Tables created...");

    const categories = [];
    for (const item of packingList) {
      const currentCategory = item.category;
      if (!categories.includes(currentCategory)) {
        categories.push(currentCategory);
      }
    }

    console.log("Beginning category insertion...");
    await Promise.all(
      categories.map(
        async (category) =>
          await pool.query(
            "INSERT INTO categories (category_name) VALUES ($1) ON CONFLICT (category_name) DO NOTHING",
            [category]
          )
      )
    );
    console.log("Categories inserted...");

    console.log("Begin item insertion and packing list creation...");
    await Promise.all(
      packingList.map(async (item) => {
        await db.insertItem(
          item.name,
          item.description,
          item.url,
          item.price,
          item.weight
        );
        await db.insertIntoPackingList(
          await db.getForeignKey("categories", "category_name", item.category),
          item.qty,
          item.worn,
          item.name,
          item.description
        );
      })
    );
    console.log("Item insertion and packing list creation complete...");

    /*
    console.log("Beginning item insertion...")
    await Promise.all(
      packingList.map(async (item) =>
        await db.insertItem(
          item.name,
          item.description,
          item.url,
          item.price,
          item.weight
        )
      )
    );
    console.log("Items inserted...");

    console.log("Beginning packing_list insertion...")
    await Promise.all(
      packingList.map(async (entry) =>
        await db.insertIntoPackingList(
          entry.category,
          entry.qty,
          entry.worn,
          entry.name,
          entry.description
        )
      )
    );
    console.log("Packing list completed, setup complete...");
    */
  } catch (err) {
    console.error("Error during database setup:", err);
  }
}

async function exportFunction() {
  await main();
}

module.exports = exportFunction;
