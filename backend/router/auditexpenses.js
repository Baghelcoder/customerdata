const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const Auditexpenses = require("../schemas/auditexpensesschema")
const requirecustmaster = require("../middlewhare/requirecustmaster")
const requireauditform = require("../middlewhare/requireauditform")
const requireworkorder = require("../middlewhare/requireworkorder")

router.post("/postauditexpenses", requirecustmaster, requireworkorder, requireauditform, async(req, res) => {
    const { auditformno } = req.body

    const auditexpenses = new Auditexpenses({
        auditformno: req.body.auditformno,
        custname: req.body.custname,
        exphead: req.body.exphead,
        expdate: req.body.expdate,
        paidby: req.body.paidby,
        paidto: req.body.paidto,
        amt: req.body.amt,
        remarks: req.body.remarks,
        auditdetails: req.auditform,
        custdetails: req.user,
        orderdetails: req.order

    })
    const result = auditexpenses.save()
    res.status(200).json({ massage: "audit expenses saved ", auditexpenses })

})

router.get("/allauditexpenses", async(req, res) => {
    try {
        const alldata = await Auditexpenses.find()
            .populate('auditdetails', "_id auditformno closeform")
            .populate("custdetails", "custname")
        res.status(200).json(alldata)
    } catch {
        res.status(400).json({ error: "server problem" })
    }
})

router.get("/getauditexpenses/:id", async(req, res) => {
    try {
        const id = req.params.id;
        const getauditexpenses = await Auditexpenses.findOne({ _id: id })
            .populate('auditdetails', "token auditformno")
            .populate("custdetails", "token")
            .populate("orderdetails", "token")
        res.json(getauditexpenses)
    } catch {
        res.status(400).json({ error: "audit expenses not found !" })
    }

})
router.patch("/editauditexpenses/:id", async(req, res) => {
    try {
        id = req.params.id;
        const bodydata = req.body
        const editauditexpenses = await Auditexpenses.findByIdAndUpdate(id, bodydata)
        res.status(200).json(editauditexpenses)
    } catch {
        res.status(400).json({ error: "server problem" })
    }
})






module.exports = router