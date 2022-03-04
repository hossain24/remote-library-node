const express = require("express");
const router = express.Router();
const UserController = require("../controller/user-controller");


router.post("/signup", UserController.signup_user);

router.get("/signin", UserController.signin_user);

router.post("/signin", UserController.signin_user);

router.delete("/:userId", UserController.delete_user);

module.exports = router;