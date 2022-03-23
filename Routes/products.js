const router = require("express").Router();
const productController = require("../Controllers/products-controller");
const multerInstance = require('../multer');


router.post("/", multerInstance.upload.single('image'), productController.createProduct);
router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);
router.delete("/:id", productController.removeProduct);


module.exports = router;