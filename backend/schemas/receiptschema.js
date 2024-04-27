const mongoose = require("mongoose")


const myreceipt = new mongoose.Schema({
    receiptdate: {
        type: String
    },
    bankname: {
        type: String
    },
    paymentMode: {
        type: String
    },
    remarks: {
        type: String
    },
    paymentagainstcb: {
        type: String
    },
    invrecdamt: {
        type: String
    },
    completeinvpayment: {
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
    invoicedetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "invoice"
    }
})

const Receiptschema = mongoose.model("receipt", myreceipt)
module.exports = Receiptschema