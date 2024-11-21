const pool = require("./pool");

function getForeignKey(foreignTable, columnToCompare, columnValue) {
  return {
    query: `(SELECT id FROM ${foreignTable} WHERE ${columnToCompare} = $1)`,
    value: columnValue,
  };
}

function itemInsertValueString(
  categoryNameLike,
  name,
  description,
  url,
  price,
  weightG
) {
  const categoryID = getForeignKey(
    "categories",
    "category_name",
    categoryNameLike
  );

  const query = `
    INSERT INTO items (category_id, name, description, url, price, weight_grams)
    VALUES (${categoryID.query}, $2, $3, $4, $5, $6);
  `;

  return {
    query,
    values: [
      categoryID.value,
      name,
      description,
      url,
      price || 0,
      weightG || 0,
    ],
  };
}

function accessoryInsertValueString(name, description, url, price, weightG) {
  return itemInsertValueString(
    "Accessories",
    name,
    description,
    url,
    price,
    weightG
  );
}

function bagInsertValueString(name, description, url, price, weightG) {
  return itemInsertValueString("Bag", name, description, url, price, weightG);
}

function clothingInsertValueString(name, description, url, price, weightG) {
  return itemInsertValueString(
    "Clothing",
    name,
    description,
    url,
    price,
    weightG
  );
}

function electronicInsertValueString(name, description, url, price, weightG) {
  return itemInsertValueString(
    "Electronics",
    name,
    description,
    url,
    price,
    weightG
  );
}

function toiletryInsertValueString(name, description, url, price, weightG) {
  return itemInsertValueString(
    "Toiletries",
    name,
    description,
    url,
    price,
    weightG
  );
}

function insertIntoPackingList(name, description, qty, isItemWorn) {
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
      SELECT items.name AS name, items.description AS description, items.url AS url, packing_list.worn AS worn, items.price AS price, items.weight_grams AS weight, packing_list.qty AS qty
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

async function submitNewMessage(name, messageText) {
  await pool.query("INSERT INTO messages (text, being) VALUES ($1, $2)", [
    messageText,
    name,
  ]);
}

module.exports = {
  accessoryInsertValueString,
  bagInsertValueString,
  clothingInsertValueString,
  electronicInsertValueString,
  toiletryInsertValueString,
  insertIntoPackingList,
  getCurrentList,
};
