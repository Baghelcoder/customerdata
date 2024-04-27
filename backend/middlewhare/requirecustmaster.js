const jwt = require("jsonwebtoken")
const custjwt = "asdfghjklmddgrngrhrergngnbc";

const requirecustmaster = (req, res, next) => {
    const token = req.header("Authorization")
    if (!token) {
        res.status(400).send({ error: "add valid token" })
    }
    try {

        const data = jwt.verify(token.split(" ")[0], custjwt)
        req.user = data.user
        next()
    } catch (error) {
        res.status(400).send({ error: "some PROBLEM 1" })
    }
}

module.exports = requirecustmaster