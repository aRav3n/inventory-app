const pool = require("./pool");
const { Client } = require("pg");

function getForeignKey(
  foreignTable,
  columnToCompare,
  columnValue,
  secondColumnToCompare,
  secondColumnValue
) {
  let substring = { query: "", value: [] };
  if (secondColumnToCompare && secondColumnValue) {
    substring = {
      query: " AND $3 LIKE $4",
      value: [secondColumnToCompare, secondColumnValue],
    };
  }
  return {
    query: `(SELECT id FROM ${foreignTable} WHERE $1 LIKE $2${substring.query})`,
    value: [columnToCompare, columnValue, ...substring.value],
  };
}

function getNewestRowForeignKey(foreignTable, columnToCompare, columnValue) {
  let subQuery = "";
  if (columnToCompare && columnValue) {
    subQuery = ` WHERE ${columnToCompare} LIKE ${columnValue}`;
  }
  return {
    query: `SELECT MAX(id) FROM ${foreignTable}${subQuery}`,
  };
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

function insertIntoPackingList(name, qty, isItemWorn) {
  const foreignKeyQuery = getForeignKey("items", "name", name);

  const query = `
    INSERT INTO packing_list (item_id, qty, worn)
    VALUES (${foreignKeyQuery}, $2, $3);
  `;

  return {
    query,
    values: [name, qty, isItemWorn],
  };
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

async function insertNewRow(category) {
  const query = itemInsertValueString(category, "", "", "", "", "");
  const { rows } = await pool.query("SELECT MAX(id) FROM items");
  const newestItemID = rows[0].max;
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
  insertIntoPackingList,
  itemInsertValueString,
  insertNewRow,
};
