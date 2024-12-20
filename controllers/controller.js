const db = require("../db/queries");
const { body, validationResult } = require("express-validator");
const populateTables = require("../db/buildAndPopulateTables");

async function addItemGet(req, res) {
  const newestItemID = await db.getNewestItemId();
  res.redirect(`/updateItem/${newestItemID}`);
}

async function addItemToCategoryGet(req, res) {
  const itemId = req.params.itemId;
  const item = await db.getSingleItemById(itemId);
  const categories = await db.getCategories();
  res.render("addToCategory", {
    categories: categories,
    item: item,
    title: "Add to Category",
  });
}

async function addItemToCategoryPost(req, res) {
  const itemId = req.params.itemId;
  const categoryId = req.params.categoryId;
  const item = await db.getSingleItemById(itemId);
  await db.insertIntoPackingList(
    categoryId,
    1,
    false,
    item.name,
    item.description
  );
  res.redirect("/");
}

async function deleteItemFromListPost(req, res) {
  const packingListItemId = req.params.packingListItemId;
  await db.removeItemFromPackingList(packingListItemId);
  res.redirect("/");
}

async function deleteItemPost(req, res) {
  const itemId = req.params.itemId;
  await db.deleteItem(itemId);
  res.redirect("/");
}

async function indexActionGet(req, res) {
  let list = await db.getCurrentList();
  if (list.length === 0) {
    await populateTables();
    list = await db.getCurrentList();
  }
  let itemList = await db.getItemList();
  if (itemList.length === 0) {
    await populateTables();
    itemList = await db.getItemList();
  }
  res.render("index", {
    title: "List",
    list: list,
    itemList: itemList,
  });
}

async function updateItemGet(req, res) {
  const id = req.params.packingListItemId;
  const item = await db.getSingleItemFromPackingList(id);
  res.render("updateItem", {
    title: "Update Item",
    id: id,
    item: item,
  });
}

async function updateItemPost(req, res) {
  const packingListItemId = req.params.packingListItemId;
  const updateObject = req.body;
  await db.updateItem(packingListItemId, updateObject);
  res.redirect("/");
}

async function toggleWornBooleanPost(req, res) {
  const id = req.params.packingListItemId;
  await db.toggleWornBoolean(id);
  res.redirect(`/updateItem/${id}`);
}

module.exports = {
  addItemGet,
  addItemToCategoryGet,
  addItemToCategoryPost,
  deleteItemFromListPost,
  deleteItemPost,
  indexActionGet,
  toggleWornBooleanPost,
  updateItemGet,
  updateItemPost,
};
