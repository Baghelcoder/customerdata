const jwt = require("jsonwebtoken")
const orderjwt = "asddsdffhrhgkrhgfghjklmnbc";

const requireworkorder = (req, res, next) => {
    const token = req.header("Authorization")

    if (!token) {
        res.status(400).send({ error: "add valid token" })
    }
    try {
        const data = jwt.verify(token.split(" ")[1], orderjwt)
        req.order = data.order
        next()
    } catch (error) {
        res.status(400).send({ error: "some PROBLEM 2" })
    }
}

module.exports = requireworkorder