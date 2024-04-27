const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const Receiptschema = require("../schemas/receiptschema")
const requirecustmaster = require("../middlewhare/requirecustmaster")
const requireworkorder = require("../middlewhare/requireworkorder")
const requireauditform = require("../middlewhare/requireauditform")
const requireinvoice = require("../middlewhare/requireinvoice")

router.post("/postreceipt", requirecustmaster, requireworkorder, requireauditform, requireinvoice, async(req, res) => {
    try {
        const receipt = new Receiptschema({
            receiptdate: req.body.receiptdate,
            bankname: req.body.bankname,
            paymentMode: req.body.paymentMode,
            remarks: req.body.remarks,
            paymentagainstcb: req.body.paymentagainstcb,
            invrecdamt: req.body.invrecdamt,
            completeinvpayment: req.body.completeinvpayment,
            auditdetails: req.auditform,
            custdetails: req.user,
            orderdetails: req.order,
            invoicedetails: req.invoice

        })
        const result = receipt.save()
        res.status(200).json({ massage: "receipt saved ", receipt })
    } catch {
        res.status(400).json({ error: "server problem" })
    }

})


router.get("/allreceipt", async(req, res) => {
    try {
        const alldata = await Receiptschema.find()
            .populate('auditdetails', "_id auditformno closeform")
            .populate('orderdetails', "wonumber companyname")
            .populate("custdetails", "custname")
            .populate('invoicedetails', 'invno invamttotal gstamtonly')
        res.status(200).json(alldata)
    } catch {
        res.status(400).json({ error: "server problem" })
    }
})

router.get("/getreceipt/:id", async(req, res) => {
    try {
        const id = req.params.id;
        const getreceipt = await Receiptschema.findOne({ _id: id })
            .populate('auditdetails', "token auditformno")
            .populate('orderdetails', "token")
            .populate("custdetails", "token")
        res.json(getreceipt)
    } catch {
        res.status(400).json({ error: "work order not found !" })
    }

})
router.patch("/editreceipt/:id", async(req, res) => {
    try {
        id = req.params.id;
        const bodydata = req.body
        const editreceipt = await Receiptschema.findByIdAndUpdate(id, bodydata)
        res.status(200).json(editreceipt)
    } catch {
        res.status(400).json({ error: "server problem" })
    }
})






module.exports = router