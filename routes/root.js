const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.send({
        message: "This is the root page"
    })
})

module.exports = router;