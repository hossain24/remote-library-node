const exprees = require('express');
const router = exprees.Router();
const multer = require('multer');
// const verifyAuth = require('../Auth/verify-token');
const BooksController = require('../controller/books-controller');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        var imgDate = new Date();
        cb(null, Date.now() + file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});


router.get("/", BooksController.books_get_all);

router.post("/", upload.single('bookImage'), BooksController.books_create_book);

router.get("/:bookId", BooksController.books_get_book);

router.patch("/:bookId", BooksController.books_update_book);

router.delete("/:bookId", BooksController.books_delete_book);

module.exports = router;