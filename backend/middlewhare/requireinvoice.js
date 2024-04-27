const jwt = require("jsonwebtoken")
const invjwt = "asdfghjklfdfgdhrmddgrngrhrergngnbc";

const requireinvoice = (req, res, next) => {
    const token = req.header("Authorization")
    if (!token) {
        res.status(400).send({ error: "add valid token" })
    }
    try {

        const data = jwt.verify(token.split(" ")[3], invjwt)
        req.invoice = data.invoice
        next()
    } catch (error) {
        res.status(400).send({ error: "some PROBLEM 1" })
    }
}

module.exports = requireinvoice