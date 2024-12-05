const pool = require("./pool");

async function getForeignKey(
  foreignTable,
  columnToCompare,
  columnValue,
  secondColumnToCompare = null,
  secondColumnValue = null
) {
  let query = `SELECT id FROM ${foreignTable} WHERE ${columnToCompare} = $1`;
  const values = [columnValue];

  if (secondColumnToCompare && secondColumnValue) {
    query += ` AND ${secondColumnToCompare} = $2`;
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

async function insertItem(name, description, url, price, weightG) {
  const query = `
    INSERT INTO items (name, description, url, price, weight_grams)
    VALUES ($1, $2, $3, $4, $5);
  `;

  const values = [
    name?.trim(),
    description?.trim(),
    url,
    Number(price) || 0,
    Number(weightG) || 0,
  ];

  await pool.query(query, values);
}

async function insertIntoPackingList(
  foreignKeyCategory,
  qty,
  isItemWorn,
  name = null,
  description = null
) {
  name = name?.trim();
  description = description?.trim();

  let foreignKeyItem;
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
  } else {
    foreignKeyItem = await getNewestItemId();
  }

  const query = `
    INSERT INTO packing_list (category_id, item_id, qty, worn)
    VALUES ($1, $2, $3, $4);
  `;
  const values = [foreignKeyCategory, foreignKeyItem, qty, isItemWorn];

  await pool.query(query, values);
}

async function getCategories() {
  const { rows } = await pool.query(
    "SELECT id, category_name FROM categories;"
  );
  return rows;
}

async function getCurrentList() {
  const categoryArray = await getCategories();
  const array = [];
  for (let i = 0; i < categoryArray.length; i++) {
    const objectToPush = {
      category: categoryArray[i].category_name,
      category_id: categoryArray[i].id,
    };
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
      FROM packing_list
      JOIN items ON packing_list.item_id = items.id
      JOIN categories ON packing_list.category_id = categories.id
      WHERE categories.category_name LIKE $1
      `,
      [objectToPush.category]
    );
    objectToPush.rows = rows;
    array.push(objectToPush);
  }
  return array;
}

async function getSingleItemFromPackingList(packingListItemId) {
  const { rows } = await pool.query(
    `
    SELECT 
        items.id AS item_id,
        packing_list.id AS list_id,
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
      FROM packing_list
      JOIN items ON packing_list.item_id = items.id
      JOIN categories ON packing_list.category_id = categories.id
      WHERE packing_list.id = $1
    `,
    [packingListItemId]
  );
  const itemObject = rows[0];
  return itemObject;
}

async function updateItem(packingListItemId, newInfoObject) {
  await pool.query(
    `
    UPDATE packing_list
    SET qty = $1
    WHERE id = $2
    `,
    [Number(newInfoObject.qty), packingListItemId]
  );

  await pool.query(
    `
    UPDATE items
    SET
      name = $1,
      description = $2,
      url = $3,
      price = $4,
      weight_grams = $5
    WHERE id = (SELECT item_id FROM packing_list WHERE id = $6)
    `,
    [
      newInfoObject.name,
      newInfoObject.description,
      newInfoObject.url,
      Number(newInfoObject.price),
      Number(newInfoObject.weight),
      Number(packingListItemId),
    ]
  );
}

async function insertNewItemRow(categoryId) {
  await insertItem("", "", "", "", "");

  await insertIntoPackingList(categoryId, 0, false);

  return;
}

async function toggleWornBoolean(packingListItemId) {
  const { rows } = await pool.query(
    `
    SELECT worn FROM packing_list WHERE id = $1
  `,
    [packingListItemId]
  );
  const currentWornBooleanValue = rows[0].worn;
  const newWornBooleanValue = !currentWornBooleanValue;
  await pool.query(`
    UPDATE packing_list 
    SET worn = $1
    WHERE id = $2
  `,
  [newWornBooleanValue, packingListItemId])
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
  getSingleItemFromPackingList,
  insertIntoPackingList,
  insertItem,
  insertNewItemRow,
  toggleWornBoolean,
  updateItem,
};
