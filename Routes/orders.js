const express = require('express');
const router = express.Router();
const verifyAuth = require('../Auth/verify-token');
const OrdersController = require('../Controllers/orders-controller');

router.get("/",  OrdersController.orders_get_all);

router.get("/:orderId", verifyAuth, OrdersController.orders_get_order);

router.post('/', OrdersController.orders_create_order);

router.delete("/:orderId", verifyAuth, OrdersController.orders_delete_order);

module.exports = router;