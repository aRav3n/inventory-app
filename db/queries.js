const pool = require("./pool");

function getForeignKey(foreignTable, columnToCompare, columnValueNeeded) {
  const foreignKey = `
    (SELECT id 
    FROM ${foreignTable} 
    WHERE ${columnToCompare} LIKE ${columnValueNeeded})
  `;
  return foreignKey;
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
  const returnString = `
    INSERT INTO items (category_id, name, description, url, price, weight_grams)
    VALUES
    ('${categoryID}, ${name}, ${description}, ${url}, ${price}, ${weightG}'),
    `;
  return returnString;
}

function accessoryInsertValueString(name, description, url, price, weightG) {
  const returnValue = itemInsertValueString(
    "Accessories",
    name,
    description,
    url,
    price,
    weightG
  );
  return returnValue;
}

function bagInsertValueString(name, description, url, price, weightG) {
  const returnValue = itemInsertValueString(
    "Electronics",
    name,
    description,
    url,
    price,
    weightG
  );
  return returnValue;
}

function clothingInsertValueString(name, description, url, price, weightG) {
  const returnValue = itemInsertValueString(
    "Electronics",
    name,
    description,
    url,
    price,
    weightG
  );
  return returnValue;
}

function electronicInsertValueString(name, description, url, price, weightG) {
  const returnValue = itemInsertValueString(
    "Electronics",
    name,
    description,
    url,
    price,
    weightG
  );
  return returnValue;
}

function toiletryInsertValueString(name, description, url, price, weightG) {
  const returnValue = itemInsertValueString(
    "Electronics",
    name,
    description,
    url,
    price,
    weightG
  );
  return returnValue;
}

async function getMessageDetails(id) {
  const { rows } = await pool.query(
    "SELECT text, being AS user, added, id FROM messages WHERE id = $1",
    $2[id]
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
  getMessageDetails,
  getMessages,
  submitNewMessage,
};
