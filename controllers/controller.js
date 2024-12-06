const db = require("../db/queries");
const { body, validationResult } = require("express-validator");
/*
const validateItem = [
  body("userName")
    .trim()
    .isAlpha()
    .withMessage("Username may only contain letters and numbers")
    .isLength({ min: 1, max: 10 })
    .withMessage("Username must be between 1 and 10 characters"),
];
*/

async function addItemGet(req, res) {
  const newestItemID = await db.getNewestItemId();
  res.redirect(`/updateItem/${newestItemID}`);
}

async function addItemToCategoryGet(req, res) {
  const itemId = req.params.itemId;
  console.log(itemId);
  res.redirect("/")
}

async function deleteItemFromListPost(req, res) {
  const packingListItemId = req.params.packingListItemId;
  await db.removeItemFromPackingList(packingListItemId);
  res.redirect("/");
}

async function indexActionGet(req, res) {
  const list = await db.getCurrentList();
  const itemList = await db.getItemList();
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
  deleteItemFromListPost,
  indexActionGet,
  toggleWornBooleanPost,
  updateItemGet,
  updateItemPost,
};
