const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const invjwt = "asdfghjklfdfgdhrmddgrngrhrergngnbc";
const Invoiceschema = require("../schemas/invoiceschema")
const requireauditform = require("../middlewhare/requireauditform")
const requirecustmaster = require("../middlewhare/requirecustmaster")
const requireworkorder = require("../middlewhare/requireworkorder");
const Receiptschema = require("../schemas/receiptschema");

router.post("/postinvoice", requirecustmaster, requireworkorder, requireauditform, async(req, res) => {
    const { sno, invno } = req.body
    Invoiceschema.findOne({ $or: [{ sno: sno }, { invno: invno }] }).then((savedUser) => {
        if (savedUser) {
            return res.status(400).json({ Error: "invoice already exist" })
        } else {
            const invoice = new Invoiceschema({
                sno: req.body.sno,
                invno: req.body.invno,
                invdate: req.body.invdate,
                pino: req.body.pino,
                invamttotal: req.body.invamttotal,
                gstamtonly: req.body.gstamtonly,
                paymentdesc: req.body.paymentdesc,
                remarks: req.body.remarks,
                gstrate: req.body.gstrate,
                auditdetails: req.auditform,
                custdetails: req.user,
                orderdetails: req.order

            })
            jwt.sign({ invoice }, invjwt, (err, token) => {
                if (err) {
                    res.status(400).json({ error: "problem generating token" })
                } else {
                    invoice.token = token
                    invoice.save().then(savedUser => {
                        return res.status(200).json({
                            invoice: savedUser,
                            status: true,
                            message: "invoice saved",
                            token: token // Send token in response
                        });
                    }).catch(err => {
                        return res.status(500).json({ error: "Failed to save invoice" });
                    });
                }
            })
        }
    })

})

router.get("/allinvoice", async(req, res) => {
    try {
        const alldata = await Invoiceschema.find()
            .populate('auditdetails', "_id auditformno closeform")
            .populate('orderdetails', "wonumber companyname")
            .populate("custdetails", "custname")

        res.status(200).json(alldata)
    } catch {
        res.status(400).json({ error: "server problem" })
    }
})

router.get("/getinvoice/:id", async(req, res) => {
    try {
        const id = req.params.id;
        const getinvoice = await Invoiceschema.findOne({ _id: id })
            .populate('auditdetails', "token auditformno")
            .populate('orderdetails', "token")
            .populate("custdetails", "token")
        res.json(getinvoice)
    } catch {
        res.status(400).json({ error: "invoice not found !" })
    }

})
router.patch("/editinvoice/:id", async(req, res) => {
    try {
        id = req.params.id;
        const bodydata = req.body
        const editinvoice = await Invoiceschema.findByIdAndUpdate(id, bodydata)
        await Receiptschema.updateMany({ invoicedetails: editinvoice._id }, {
            $set: {
                invno: editinvoice.invno,
                invdate: editinvoice.invdate,
                pino: editinvoice.pino,
                invamttotal: editinvoice.invamttotal,
                gstrate: editinvoice.gstrate,
                gstamtonly: editinvoice.gstamtonly,
                paymentdesc: editinvoice.paymentdesc,
                remarks: editinvoice.remarks
            }
        })
        res.status(200).json(editinvoice)
    } catch {
        res.status(400).json({ error: "server problem" })
    }
})




module.exports = router