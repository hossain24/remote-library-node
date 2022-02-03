const mongoose = require("mongoose");
const User = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup_user = (req, res, next) => {
    User.find({ email: req.body.email })
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
};

exports.signin_user = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: "Auth failed"
                    });
                }
                if (result) {
                    const accessToken = jwt.sign(
                        {
                            email: user[0].email,
                            userId: user[0]._id
                        },
                        process.env.JWT_Secret_Access,
                        {
                            expiresIn: "1h"
                        }
                    );

                    // Refresh token
                    const refreshToken = jwt.sign(
                        {
                            email: user[0].email,
                            userId: user[0]._id
                        },
                        process.env.JWT_Secret_Refresh,
                        {
                            expiresIn: "5m",
                        }
                    );

                    console.log(accessToken);
                    console.log(refreshToken);
                    // Set refersh token in refreshTokens array
                    refreshTokens.push(refreshToken);

                    return res.status(200).json({
                        message: "Auth successful",
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        // refreshTokens: refreshTokens
                    });
                }
                res.status(401).json({
                    message: "Auth failed"
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });


    console.log(refreshTokens);

};

const refreshTokens = [];

// Create new access token from refresh token
exports.refresh_token = ((req, res) => {
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
        const user = jwt.verify(
            refreshToken,
            process.env.JWT_Secret_Refresh
        );

        const { email } = user;
        const accessToken = jwt.sign(
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
exports.delete_token = (req, res) => {
    const refreshToken = req.header("x-auth-token");

    refreshTokens.splice(refreshToken);
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    res.sendStatus(204);
};

exports.delete_user = (req, res, next) => {
    User.remove({ _id: req.params.userId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "User deleted"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};