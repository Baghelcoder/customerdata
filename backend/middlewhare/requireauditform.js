const jwt = require("jsonwebtoken")
const jwtkey = "asdfghjklmnbc";

const requireauditform = (req, res, next) => {
    const token = req.header("Authorization")
    if (!token) {
        res.status(400).send({ error: "add valid token" })
    }
    try {
        const data = jwt.verify(token.split(" ")[2], jwtkey)
        req.auditform = data.auditform
        next()
    } catch (error) {
        res.status(400).send({ error: "some PROBLEM" })
    }
}

module.exports = requireauditform