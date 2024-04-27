const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const Workorderschema = require("../schemas/workorderschema")
const requirecustmaster = require("../middlewhare/requirecustmaster")
const jwt = require("jsonwebtoken")
const Auditformschema = require("../schemas/auditformschema")
const orderjwt = "asddsdffhrhgkrhgfghjklmnbc";


router.post("/workorder", requirecustmaster, (req, res) => {
    const { sno, wonumber } = req.body

    Workorderschema.findOne({ $or: [{ sno: sno }, { wonumber: wonumber }] }).then((savedUser) => {
        if (savedUser) {
            return res.status(400).json({ Error: "order already exist" })
        } else {
            const order = new Workorderschema({
                sno: req.body.sno,
                wonumber: req.body.wonumber,
                wodate: req.body.wodate,
                companyname: req.body.companyname,
                basicamt: req.body.basicamt,
                gstrate: req.body.gstrate,
                taxamt: req.body.taxamt,
                travelamt: req.body.travelamt,
                wonetamt: req.body.wonetamt,
                workstatus: req.body.workstatus,
                remarks: req.body.remarks,
                postedby: req.user
            })
            jwt.sign({ order }, orderjwt, (err, token) => {
                if (err) {
                    res.status(400).json({ error: "problem generating token" })
                } else {
                    order.token = token
                    order.save().then(savedorder => {
                        res.status(200).json({
                            savedorder,
                            status: true,
                            message: "order created successfully",
                            token: token // Send token in response
                        });
                    }).catch(err => {
                        return res.status(500).json({ error: "Failed to save order" });
                    });
                }
            })
        }
    })


})

router.get("/getsno", async(req, res) => {
    try {
        const getsno = await Workorderschema.find()
            .populate('postedby', "_id custname")
        res.status(200).json(getsno)
    } catch {
        res.status(400).json({ error: "server problem" })
    }
})

router.get("/getworkorder/:id", async(req, res) => {
    try {
        const id = req.params.id;
        const getworkorder = await Workorderschema.findOne({ _id: id })
            .populate('postedby', "_id custname custID nickname address city state pin phone token")
        res.json(getworkorder)
    } catch {
        res.status(400).json({ error: "work order not found !" })
    }

})

router.patch("/editorder/:id", async(req, res) => {
    try {
        id = req.params.id;
        const bodydata = req.body
        const editorder = await Workorderschema.findByIdAndUpdate(id, bodydata)
        await Auditformschema.updateMany({ orderdetails: editorder._id }, {
            $set: {
                basicamt: editorder.basicamt,
                gstrate: editorder.gstrate,
                taxamt: editorder.taxamt,
                wonetamt: editorder.wonetamt,
                travelamt: editorder.travelamt,
                workstatus: editorder.workstatus,
                remarks: editorder.remarks,
                companyname: editorder.companyname,
                wodate: editorder.wodate,
                wonumber: editorder.wonumber
            }
        })
        res.status(200).json(editorder)
    } catch {
        res.status(400).json({ error: "server problem" })
    }
})


module.exports = router