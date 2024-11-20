const pool = require("./pool");

function getForeignKey(foreignTable, columnToCompare, columnValue) {
  return `(SELECT id FROM ${foreignTable} WHERE ${columnToCompare} = $1)`;
}

function itemInsertValueString(
  categoryNameLike,
  name,
  description,
  url,
  price,
  weightG
) {
  const foreignKeyQuery = getForeignKey(
    "categories",
    "category_name",
    categoryNameLike
  );

  const query = `
    INSERT INTO items (category_id, name, description, url, price, weight_grams)
    VALUES (${foreignKeyQuery}, $2, $3, $4, $5, $6);
  `;

  return {
    query,
    values: [
      categoryNameLike,
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

async function getMessageDetails(id) {
  const { rows } = await pool.query(
    "SELECT text, being AS user, added, id FROM messages WHERE id = $1",
    [id]
  );
  return rows[0];
}

async function getMessages() {
  const { rows } = await pool.query(
    "SELECT text, being AS user, added, id FROM messages"
  );
  return rows;
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
  getMessageDetails,
  getMessages,
  submitNewMessage,
};
