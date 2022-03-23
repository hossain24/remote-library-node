const router = require("express").Router();
const cartController = require("../Controllers/cart-controller");


router.get("/", cartController.getCart);
router.post("/", cartController.addItemToCart);
router.delete("/", cartController.removeItemFromCart);
router.delete("/empty-cart", cartController.emptyCart);


module.exports = router;