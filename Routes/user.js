const express = require("express");
const router = express.Router();
const verifyAuth = require('../Auth/verify-token');
const UserController = require("../Controllers/user-controller");



router.post("/signup", UserController.signup_user);

router.get("/signin", UserController.signin_user);

router.post("/signin", UserController.signin_user);

router.delete("/:userId", verifyAuth, UserController.delete_user);

router.post("/token", verifyAuth, UserController.refresh_token);

router.delete("/logout/token", verifyAuth, UserController.delete_token);

module.exports = router;