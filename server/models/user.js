const mongoose = require('mongoose');
const bcrypt = require("bcrypt-nodejs");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String, required: true, unique: true },    
    password: { type: String, required: true},
    createdAt: { type: Date, default: Date.now}
});

const User = mongoose.model("User", userSchema);

module.exports = User;