const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const Nonauditexpenses = require("../schemas/nonauditexpensesschema")

router.post("/postnonauditexpenses", async(req, res) => {
    const { sno } = req.body
    Nonauditexpenses.findOne({ $or: [{ sno: sno }] }).then((savedUser) => {
        if (savedUser) {
            return res.status(400).json({ Error: "nonaudit expenses already exist" })
        } else {
            const nonauditexpenses = new Nonauditexpenses({
                sno: req.body.sno,
                companyname: req.body.companyname,
                exphead: req.body.exphead,
                expdate: req.body.expdate,
                paymentmode: req.body.paymentmode,
                paidto: req.body.paidto,
                expamt: req.body.expamt,
                expdetails: req.body.expdetails,

            })
            const result = nonauditexpenses.save()
            res.status(200).json({ massage: "nonaudit expenses saved ", nonauditexpenses })
        }
    })

})

router.get("/allnonauditexpenses", async(req, res) => {
    try {
        const alldata = await Nonauditexpenses.find()
        res.status(200).json(alldata)
    } catch {
        res.status(400).json({ error: "server problem" })
    }
})

router.get("/getnonauditexpenses/:id", async(req, res) => {
    try {
        const id = req.params.id;
        const getnonauditexpenses = await Nonauditexpenses.findOne({ _id: id })
        res.json(getnonauditexpenses)
    } catch {
        res.status(400).json({ error: "audit expenses not found !" })
    }

})
router.patch("/editnonauditexpenses/:id", async(req, res) => {
    try {
        id = req.params.id;
        const bodydata = req.body
        const editnonauditexpenses = await Nonauditexpenses.findByIdAndUpdate(id, bodydata)
        res.status(200).json(editnonauditexpenses)
    } catch {
        res.status(400).json({ error: "server problem" })
    }
})






module.exports = router