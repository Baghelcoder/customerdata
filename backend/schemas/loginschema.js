const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const LoginSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phonenumber: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

LoginSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 8);
    next();
});

LoginSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Login', LoginSchema);