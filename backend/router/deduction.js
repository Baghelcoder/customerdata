const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const Deductionschema = require("../schemas/deductionschema")
const requirecustmaster = require("../middlewhare/requirecustmaster")
const requireauditform = require("../middlewhare/requireauditform")
const requireworkorder = require("../middlewhare/requireworkorder")

router.post("/postdeduction", requirecustmaster, requireworkorder, requireauditform, async(req, res) => {
    const { auditformno } = req.body
    const deduction = new Deductionschema({
        dateofdedn: req.body.dateofdedn,
        amount: req.body.amount,
        deductionhead: req.body.deductionhead,
        remarks: req.body.remarks,
        auditdetails: req.auditform,
        custdetails: req.user,
        orderdetails: req.order

    })
    const result = deduction.save()
    res.status(200).json({ massage: "deduction saved ", deduction })
})


router.get("/alldeduction", async(req, res) => {
    try {
        const alldata = await Deductionschema.find()
            .populate('auditdetails', "_id auditformno closeform")
            .populate("custdetails", "custname")
        res.status(200).json(alldata)
    } catch {
        res.status(400).json({ error: "server problem" })
    }
})

router.get("/getdeduction/:id", async(req, res) => {
    try {
        const id = req.params.id;
        const getdeduction = await Deductionschema.findOne({ _id: id })
            .populate('auditdetails', "_id auditformno ")
        res.json(getdeduction)
    } catch {
        res.status(400).json({ error: "deduction not found !" })
    }

})
router.patch("/editdeduction/:id", async(req, res) => {
    try {
        id = req.params.id;
        const bodydata = req.body
        const editdeduction = await Deductionschema.findByIdAndUpdate(id, bodydata)
        res.status(200).json(editdeduction)
    } catch {
        res.status(400).json({ error: "server problem" })
    }
})






module.exports = router