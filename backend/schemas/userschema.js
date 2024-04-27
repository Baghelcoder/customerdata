const mongoose = require("mongoose")

const userschema = new mongoose.Schema({
    custID: {
        type: Number
    },
    nickname: {
        type: String
    },
    custname: {
        type: String
    },
    address: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    pin: {
        type: Number
    },
    contactperson: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: Number
    },
    gstn: {
        type: String
    },
    nabluserid: {
        type: String
    },
    nablpass: {
        type: String
    },
    referrer: {
        type: String
    },
    CustOnAccOf: {
        type: String
    },
    remarks: {
        type: String
    },
    token: {
        type: String
    }
})


const User = mongoose.model("custmaster", userschema)
module.exports = User