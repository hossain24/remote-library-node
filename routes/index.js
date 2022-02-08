var express = require('express');
var router = express.Router();

// root page
router.get('/', function (req, res, next) {
  res.send("This is a book-store API");
});

module.exports = router;
