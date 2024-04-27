const mongoose = require("mongoose")

const mynonauditexpenses = new mongoose.Schema({
    sno: {
        type: Number
    },
    companyname: {
        type: String
    },
    exphead: {
        type: String
    },
    expdate: {
        type: String
    },
    expamt: {
        type: String
    },
    paymentmode: {
        type: String
    },
    expdetails: {
        type: String
    }
})

const Nonauditexpenses = mongoose.model("nonauditexpenses", mynonauditexpenses)
module.exports = Nonauditexpenses