const mongoose = require("mongoose");

const notificationsSchema = new mongoose.Schema({
    notiUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    activeUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Posts"
    },
    description: {
        type: String
    },
    status : {
        type: Number,
        default: 0
    }
});
notificationsSchema.set('timestamps', true);
module.exports = mongoose.model('Notifications', notificationsSchema);
