const mongoose = require("mongoose")

const mydeduction = new mongoose.Schema({
    dateofdedn: {
        type: String
    },
    amount: {
        type: Number
    },
    deductionhead: {
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
    }
})

const Deductionschema = mongoose.model("deduction", mydeduction)
module.exports = Deductionschema