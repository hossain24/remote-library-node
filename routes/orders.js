const express = require('express');
const router = express.Router();
const OrdersController = require('../controller/orders-controller');

router.get("/", OrdersController.orders_get_all);

router.get("/:orderId", OrdersController.orders_get_order);

router.post('/', OrdersController.orders_create_order);

router.delete("/:orderId", OrdersController.orders_delete_order);

module.exports = router;