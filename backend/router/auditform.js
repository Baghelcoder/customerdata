const express = require("express")
const mongoose = require("mongoose")
const router = express.Router()
const Auditformschema = require("../schemas/auditformschema")
const jwtkey = "asdfghjklmnbc";
const jwt = require("jsonwebtoken");
const requirecustmaster = require("../middlewhare/requirecustmaster");
const requireworkorder = require("../middlewhare/requireworkorder");
const Invoiceschema = require("../schemas/invoiceschema");

router.post("/auditform", requirecustmaster, requireworkorder, (req, res) => {
    const { auditformno } = req.body

    Auditformschema.findOne({ $or: [{ auditformno: auditformno }] }).then((savedUser) => {
        if (savedUser) {
            return res.status(400).json({ Error: "auditform already exist" })
        } else {
            const auditform = new Auditformschema({
                auditformno: req.body.auditformno,
                monthstart: req.body.monthstart,
                yearstart: req.body.yearstart,
                standard: req.body.standard,
                audittype: req.body.audittype,
                cbname: req.body.cbname,
                worktype: req.body.worktype,
                remarks: req.body.remarks,
                nextduemonthyear: req.body.nextduemonthyear,
                closeform: req.body.closeform,
                custdetails: req.user,
                orderdetails: req.order
            })
            jwt.sign({ auditform }, jwtkey, (err, token) => {
                if (err) {
                    res.status(400).json({ error: "problem generating token" })
                } else {
                    auditform.token = token
                    auditform.save().then(savedUser => {
                        return res.status(200).json({
                            auditform: savedUser,
                            status: true,
                            message: "auditform saved",
                            token: token // Send token in response
                        });
                    }).catch(err => {
                        return res.status(500).json({ error: "Failed to save user" });
                    });
                }

            })
        }
    })
})


router.get("/allauditform", async(req, res) => {
    try {
        const alldata = await Auditformschema.find()
            .populate('custdetails', "custname")
            .populate('orderdetails', 'wonumber companyname basicamt wonetamt')
        res.status(200).json(alldata)
    } catch {
        res.status(400).json({ error: "server problem" })
    }
})

router.get("/getauditform/:id", async(req, res) => {
    try {
        const id = req.params.id;
        const getauditform = await Auditformschema.findOne({ _id: id })
            .populate('custdetails', " token")
            .populate('orderdetails', ' token wonumber')
        const token = getauditform.token
        res.status(200).json({
            auditform: getauditform,
            status: true,

        })
    } catch {
        res.status(400).json({ error: "work order not found !" })
    }

})
router.patch("/editauditform/:id", async(req, res) => {
    try {
        id = req.params.id;
        const bodydata = req.body
        const editauditform = await Auditformschema.findByIdAndUpdate(id, bodydata)
        await Invoiceschema.updateMany({ auditdetails: editauditform._id }, {
            $set: {
                auditformno: editauditform.auditformno,
                monthstart: editauditform.monthstart,
                yearstart: editauditform.yearstart,
                standard: editauditform.standard,
                audittype: editauditform.audittype,
                cbname: editauditform.cbname,
                worktype: editauditform.worktype,
                nextduemonthyear: editauditform.nextduemonthyear,
                closeform: editauditform.closeform,
                remarks: editauditform.remarks

            }
        })
        res.status(200).json(editauditform)
    } catch {
        res.status(400).json({ error: "server problem" })
    }
})






module.exports = router