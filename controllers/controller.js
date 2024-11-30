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
  const category = req.params.category;
  console.log(category);
  await db.insertNewRow(category);
  const newestItemID = await db.getNewestItemId();
  
  res.redirect("/");
}

async function indexActionGet(req, res) {
  const list = await db.getCurrentList();
  res.render("index", {
    title: "List",
    list: list,
  });
}

function updateItemGet(req, res) {
  const itemId = req.params.itemId;

}

/*
newActionPost = [
  validateUser,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("createUser", {
        title: "Create user",
        errors: errors.array(),
      });
    }
    const { userName } = req.body;
    await db.insertUsername(userName);
    res.redirect("/");
  },
];

async function searchActionGet(req, res) {
  const { searchString } = req.query;
  const searchResults = await db.searchUsers(searchString);
  res.render("search", {
    title: "Search Results",
    searchResults: searchResults,
  });
}
*/

module.exports = {
  addItemGet,
  indexActionGet,
  updateItemGet,
};
