const mongoose = require("mongoose")

const allinvoice = new mongoose.Schema({
    sno: {
        type: Number
    },
    invno: {
        type: String
    },
    invdate: {
        type: String
    },
    pino: {
        type: String
    },
    invamttotal: {
        type: Number
    },
    gstamtonly: {
        type: Number
    },
    gstrate: {
        type: Number
    },
    paymentdesc: {
        type: String
    },
    remarks: {
        type: String
    },
    auditdetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "auditforms"
    },
    custdetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "custmaster"
    },
    orderdetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "workorder"
    },
    token: {
        type: String
    }
})

const Invoiceschema = mongoose.model("invoice", allinvoice)
module.exports = Invoiceschema