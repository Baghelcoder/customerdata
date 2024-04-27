const express = require("express")
const cors = require("cors")
const server = express()
const port = 1001
const bodyParser = require("body-parser")
server.use(cors(origin = "*"))
const bcrypt = require('bcrypt');
const mongoose = require("mongoose")
const User = require("./schemas/userschema")
const custjwt = "asdfghjklmddgrngrhrergngnbc";
const jwt = require("jsonwebtoken")
const requirecustmaster = require("./middlewhare/requirecustmaster")
const Workorderschema = require("./schemas/workorderschema");
const loginschema = require("./schemas/loginschema");

server.use(bodyParser.urlencoded({ extended: false }))
server.use(bodyParser.json())

server.use(require("./router/workorder"))
server.use(require("./router/invoice"))
server.use(require("./router/auditform"))
server.use(require("./router/receipt"))
server.use(require("./router/auditexpenses"))
server.use(require("./router/nonauditexpenses"))
server.use(require("./router/deduction"))

mongoose.connect("mongodb://localhost:27017/server", {
    family: 4
}).then(() => {
    console.log("database is connected..........")
}).catch((e) => {
    console.log("no database is found.............")
})

server.post("/custmaster", (req, res) => {
    const { custID, nickname, custname, address, city, state, pin, contactperson, email, phone, gstn, nabluserid, nablpass, referrer, CustOnAccOf, remarks } = req.body

    if (!custID || !nickname || !custname || !address || !city || !state || !pin || !contactperson || !email || !phone || !gstn || !nabluserid || !nablpass || !referrer || !CustOnAccOf || !remarks) {
        return res.status(400).json({ Error: "please add all field" })
    } else {
        User.findOne({ $or: [{ custID: custID }, { nickname: nickname }] }).then((savedUser) => {
            if (savedUser) {
                return res.status(400).json({ Error: "customer already exist" })
            } else {
                const user = new User(req.body)
                jwt.sign({ user }, custjwt, (err, token) => {
                    if (err) {
                        res.status(400).json({ error: "problem generating token" })
                    } else {
                        user.token = token; // Add token to user object
                        user.save().then(savedUser => {
                            res.status(200).json({
                                savedUser,
                                status: true,
                                message: "User created successfully",
                                token: token // Send token in response
                            });
                        }).catch(err => {
                            return res.status(500).json({ error: "Failed to save user" });
                        });

                    }
                })
            }
        })
    }
})



server.get("/getcustmaster/:id", async(req, res) => {
    try {
        const id = req.params.id;
        const getcustmaster = await User.findOne({ _id: id })
        const token = getcustmaster.token;
        res.status(200).json({
            custmaster: getcustmaster,
            status: true,
            massage: "user login.....",
        })
    } catch {
        res.status(400).json({ error: "server problem" })
    }

})

server.get("/allcust/:id", async(req, res) => {
    try {
        id = req.params.id;
        const getallcust = await User.findOne({ _id: id })
        res.status(200).json(getallcust)
    } catch {
        res.status(400).json({ error: "server problem" })
    }
})

server.patch("/editcustomer/:id", async(req, res) => {
    try {
        id = req.params.id;
        const bodydata = req.body
        const editcust = await User.findByIdAndUpdate(id, bodydata)
        await Workorderschema.updateMany({ postedby: editcust._id }, {
            $set: {
                custname: editcust.custname
            }
        })
        res.status(200).json(editcust)
    } catch {
        res.status(400).json({ error: "server problem" })
    }
})

server.get("/allcustomer", async(req, res) => {
    try {
        const alldata = await User.find()
        res.status(200).json(alldata)
    } catch {
        res.status(400).json({ error: "server problem" })
    }
})



/*login systom ...............................*/
server.post('/register', async(req, res) => {
    try {
        let { name, email, phonenumber, password } = req.body;
        let user = new loginschema({ name, email, phonenumber, password });
        await user.save();
        res.status(200).json({ massage: 'User created' });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

server.post("/login", async(req, res) => {
    const { phonenumber, password } = req.body;

    if (!phonenumber || !password) {
        return res.status(400).json({ Error: "please add email and password" })
    }
    loginschema.findOne({ phonenumber: phonenumber }).then((savedUser) => {
        if (!savedUser) {
            return res.status(400).json({ Error: "invalid phon number" })
        }
        bcrypt.compare(password, savedUser.password)
            .then((match) => {
                if (match) {
                    return res.status(200).json({ massage: "signin successfully" })
                } else {
                    return res.status(400).json({ error: "invalid password" })
                }
            })
            .catch(err => console.log(err))
    })
})


server.listen(port, (req, res) => {
    try {
        console.log(`http://localhost:${port}`)
    } catch (e) {
        console.log(e)
    }
})