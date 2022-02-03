const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../Models/User");

require("dotenv").config();

// Sign up
router.post(
    "/signup",
    [
        check("email", "Invalid email").isEmail(),
        check("password", "Password must be at least 6 chars long").isLength({
            min: 6,
        }),
    ],
    async (req, res) => {
        const { email, password } = req.body;

        // Validate user input
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }

        // Validate if user already exists
        let user = User.find({ email: req.body.email })
            .exec()
            .then(user => {
                if (user.length >= 1) {
                    return res.status(409).json({
                        message: "Mail exists"
                    });
                } else {
                    bcrypt.hash(req.body.password, 10, (err, hash) => {
                        if (err) {
                            return res.status(500).json({
                                error: err
                            });
                        } else {
                            const user = new User({
                                _id: new mongoose.Types.ObjectId(),
                                email: req.body.email,
                                password: hash
                            });
                            user
                                .save()
                                .then(result => {
                                    console.log(result);
                                    res.status(201).json({
                                        message: "User created"
                                    });
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(500).json({
                                        error: err
                                    });
                                });
                        }
                    });
                }
            });

        // Do not include sensitive information in JWT
        // const accessToken = await JWT.sign(
        //     { email },
        //     process.env.JWT_Secret_Access,
        //     {
        //         expiresIn: "1m",
        //     }
        // );

        // res.json({
        //     accessToken,
        // });
    }
);

// Error status code
// 401 Unauthorized: it’s for authentication, not authorization. Server says "you're not authenticated".
// 403 Forbidden: it's for authorization. Server says "I know who you are,
// but you just don’t have permission to access this resource".


// Get all users
router.get("/users", async (req, res) => {
    User.find()
        .select("_id email password")
        .exec()
        .then(docs => {
            const response =
                docs.map(doc => {
                    return {
                        _id: doc._id,
                        email: doc.email,
                        password: doc.password
                    };
                })

            if (docs.length >= 0) {
                res.status(200).send(response);
            } else {
                res.status(404).send({ message: "No data found!" })
            }
        })
        .catch(err => res.status(500).send({ message: err }));
});

// Log in
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Look for user email in the database
    let user = User.find((user) => {
        return email === req.body.email;
    });

    // If user not found, send error message
    if (!user) {
        return res.status(400).json({
            errors: [
                {
                    msg: "Invalid credentials",
                },
            ],
        });
    }

    // Compare hased password with user password to see if they are valid
    let isMatch = await bcrypt.compare(req.body.password, password);

    if (!isMatch) {
        return res.status(401).json({
            errors: [
                {
                    msg: "Email or password is invalid",
                },
            ],
        });
    }

    // Send JWT access token
    const accessToken = await JWT.sign(
        { email },
        process.env.JWT_Secret_Access,
        {
            expiresIn: "30m",
        }
    );

    // Refresh token
    const refreshToken = await JWT.sign(
        { email },
        process.env.JWT_Secret_Refresh,
        {
            expiresIn: "1h",
        }
    );

    // Set refersh token in refreshTokens array
    refreshTokens.push(refreshToken);

    res.json({
        accessToken,
        refreshToken,
    });
});

const refreshTokens = [];

// Create new access token from refresh token
router.post("/token", async (req, res) => {
    const refreshToken = req.header("x-auth-token");

    // If token is not provided, send error message
    if (!refreshToken) {
        res.status(401).json({
            errors: [
                {
                    msg: "Token not found",
                },
            ],
        });
    }

    // If token does not exist, send error message
    if (!refreshTokens.includes(refreshToken)) {
        res.status(403).json({
            errors: [
                {
                    msg: "Invalid refresh token",
                },
            ],
        });
    }

    try {
        const user = await JWT.verify(
            refreshToken,
            process.env.JWT_Secret_Refresh
        );
        // user = { email: 'jame@gmail.com', iat: 1633586290, exp: 1633586350 }
        const { email } = user;
        const accessToken = await JWT.sign(
            { email },
            process.env.JWT_Secret_Access,
            { expiresIn: "15m" }
        );
        res.json({ accessToken });
    } catch (error) {
        res.status(403).json({
            errors: [
                {
                    msg: "Invalid token",
                },
            ],
        });
    }
});

// Deauthenticate - log out
// Delete refresh token
router.delete("/logout", (req, res) => {
    const refreshToken = req.header("x-auth-token");

    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    res.sendStatus(204);
});

module.exports = router;