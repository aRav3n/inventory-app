const { Router } = require("express");
const controller = require("../controllers/controller");
const router = Router();

router.get("/", controller.indexActionGet);
router.get("/addItem/:category", controller.addItemGet);
router.get("/addItemToCategory/:itemId", controller.addItemToCategoryGet);
router.post(
  "/addItemToCategory/:itemId/:categoryId",
  controller.addItemToCategoryPost
);
router.post("/deleteItem/:itemId", controller.deleteItemPost);
router.post(
  "/removeItemFromList/:packingListItemId",
  controller.deleteItemFromListPost
);
router.post(
  "/toggleWornPost/:packingListItemId",
  controller.toggleWornBooleanPost
);
router.get("/updateItem/:packingListItemId", controller.updateItemGet);
router.post("/updateItem/:packingListItemId", controller.updateItemPost);

module.exports = router;
