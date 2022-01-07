const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.send(
        [
            { name: "Hassan Jamil", age: 30 },
            { name: "Hossain Jamil", age: 35 },
            { name: "Ali Jamil", age: 40 }
        ]
    )
})

module.exports = router;