const pool = require("./pool");

async function getForeignKey(
  foreignTable,
  columnToCompare,
  columnValue,
  secondColumnToCompare = null,
  secondColumnValue = null
) {
  let query = `SELECT id FROM ${foreignTable} WHERE ${columnToCompare} LIKE $1`;
  const values = [columnValue];

  if (secondColumnToCompare && secondColumnValue) {
    query += ` AND ${secondColumnToCompare} LIKE $2`;
    values.push(secondColumnValue);
  }

  const { rows } = await pool.query(query, values);
  return rows[0]?.id || null;
}

async function getNewestItemId() {
  const { rows } = await pool.query("SELECT MAX(id) AS max FROM items");
  const newestItemID = rows[0]?.max || null;

  if (!newestItemID) {
    throw new Error("No items found in the database.");
  }

  return newestItemID;
}

function itemInsertValueString(name, description, url, price, weightG) {
  const query = `
    INSERT INTO items (name, description, url, price, weight_grams)
    VALUES ($1, $2, $3, $4, $5);
  `;

  return {
    query,
    values: [name, description, url, price || 0, weightG || 0],
  };
}

async function insertIntoPackingList(
  category,
  qty,
  isItemWorn,
  name = null,
  description = null
) {
  const foreignKeyCategory = await getForeignKey(
    "categories",
    "category_name",
    category
  );
  if (!foreignKeyCategory) {
    throw new Error(`Category ${category} not found!`);
  }

  let foreignKeyItem = await getNewestItemId();
  if (name && description) {
    foreignKeyItem = await getForeignKey(
      "items",
      "name",
      name,
      "description",
      description
    );
    if (!foreignKeyItem) {
      throw new Error(
        `Item "${name}" with description "${description}" not found.`
      );
    }
  }

  const query = `
    INSERT INTO packing_list (category_id, item_id, qty, worn)
    VALUES ($1, $2, $3, $4);
  `;
  const values = [foreignKeyCategory, foreignKeyItem, qty, isItemWorn];

  await pool.query(query, values);

  return;
}

async function getCategories() {
  const { rows } = await pool.query("SELECT category_name FROM categories;");
  return rows;
}

async function getCurrentList() {
  const categoryArray = await getCategories();
  const array = [];
  for (let i = 0; i < categoryArray.length; i++) {
    const objectToPush = { category: categoryArray[i].category_name };
    const { rows } = await pool.query(
      `
      SELECT 
        items.name AS name, 
        items.description AS description, 
        items.url AS url, 
        packing_list.worn AS worn, 
        CASE 
          WHEN items.price = 0 THEN '0.00'
          ELSE TO_CHAR(items.price, '999999999.00') 
        END AS price,
        items.weight_grams AS weight, 
        packing_list.qty AS qty, 
        (packing_list.qty * items.weight_grams) AS total_weight
      FROM categories
      JOIN items ON categories.id = items.category_id
      JOIN packing_list ON items.id = packing_list.item_id
      WHERE categories.category_name LIKE $1
      `,
      [objectToPush.category]
    );
    objectToPush.rows = rows;
    array.push(objectToPush);
  }
  return array;
}

async function updateItem(id) {}

async function insertNewItemRow(category) {
  const itemQuery = itemInsertValueString("", "", "", "", "");
  await pool.query(itemQuery.query, itemQuery.values);

  await insertIntoPackingList(category, 0, false)

  return;
}

async function submitNewMessage(name, messageText) {
  await pool.query("INSERT INTO messages (text, being) VALUES ($1, $2)", [
    messageText,
    name,
  ]);
}

module.exports = {
  getCurrentList,
  getForeignKey,
  getNewestItemId,
  insertIntoPackingList,
  itemInsertValueString,
  insertNewItemRow,
};
