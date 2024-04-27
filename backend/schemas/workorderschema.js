const mongoose = require("mongoose")

const workorder = new mongoose.Schema({
    sno: {
        type: Number
    },
    wonumber: {
        type: String
    },
    wodate: {
        type: String
    },
    companyname: {
        type: String
    },
    basicamt: {
        type: Number
    },
    gstrate: {
        type: Number
    },
    taxamt: {
        type: Number
    },
    travelamt: {
        type: String
    },
    wonetamt: {
        type: Number
    },
    workstatus: {
        type: String
    },
    remarks: {
        type: String
    },
    postedby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "custmaster"
    },
    token: {
        type: String
    }
})

const Workorderschema = mongoose.model("workorder", workorder)
module.exports = Workorderschema