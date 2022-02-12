const mongoose = require("mongoose");

const fcmTokensSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    tokens: [{
        type: String,
    }]
});
fcmTokensSchema.set('timestamps', true);
module.exports = mongoose.model('FcmTokens', fcmTokensSchema);
