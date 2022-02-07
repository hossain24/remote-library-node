var express = require('express');
var router = express.Router();

// hard coded data page
router.get('/', function (req, res, next) {
  res.send([{ name: "Hassan Jamil", age: 30 },
  { name: "Hassan Jamil", age: 30 },
  { name: "Hassan Jamil", age: 30 }
  ]);
});

module.exports = router;
