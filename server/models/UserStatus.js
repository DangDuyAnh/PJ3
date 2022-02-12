const mongoose = require("mongoose");

const userStatusSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    status: {
        type: String,
    },
    lastSeen: {
        type: Date
    }
});
userStatusSchema.set('timestamps', true);
module.exports = mongoose.model('UserStatusSchemas', userStatusSchema);
