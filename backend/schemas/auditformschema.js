const mongoose = require("mongoose")

const myauditform = new mongoose.Schema({
    auditformno: {
        type: String
    },
    monthstart: {
        type: String
    },
    yearstart: {
        type: String
    },
    standard: {
        type: String
    },
    audittype: {
        type: String
    },
    cbname: {
        type: String
    },
    worktype: {
        type: String
    },
    basicamt: {
        type: Number
    },
    wonetamt: {
        type: Number
    },
    nextduemonthyear: {
        type: String
    },
    remarks: {
        type: String
    },
    closeform: {
        type: String
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

const Auditformschema = mongoose.model("auditforms", myauditform)
module.exports = Auditformschema