const mongoose = require("mongoose")

const myauditexpenses = new mongoose.Schema({
    exphead: {
        type: String
    },
    expdate: {
        type: String
    },
    amt: {
        type: String
    },
    paidby: {
        type: String
    },
    paidto: {
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

const Auditexpenses = mongoose.model("auditexpenses", myauditexpenses)
module.exports = Auditexpenses