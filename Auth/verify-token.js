const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    //const token = req.headers.authorization.split(" ")[1]
    const token = req.header("x-auth-token");

    if (!token) {
        res.status(401).json({
            errors: [
                {
                    msg: "Token not found",
                },
            ],
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_Secret_Access);
        console.log(token, decoded);
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }

    // try {
    //     const user = await jwt.verify(token, process.env.JWT_Secret_Access);
    //     req.user = user.email;
    //     next();
    // } catch (error) {
    //     res.status(403).json({
    //         errors: [
    //             {
    //                 msg: "Invalid token",
    //             },
    //         ],
    //     });
    // }


};