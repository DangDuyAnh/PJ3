const mongoose = require("mongoose");
const {GENDER_SECRET} = require("../constants/constants");
const {GENDER_FEMALE} = require("../constants/constants");
const {GENDER_MALE} = require("../constants/constants");

const usersSchema = new mongoose.Schema({
    phonenumber: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        max: 255,
        min: 6,
    },
    gender: {
        type: String,
        enum: [GENDER_MALE, GENDER_FEMALE, GENDER_SECRET],
        required: false,
        default: GENDER_SECRET,
    },
    birthday: {
        type: Date,
        required: false
    },
    description: {
        type: String,
        required: false,
    },
    address: {
        type: String,
        required: false,
    },
    city: {
        type: String,
        required: false,
    },
    country: {
        type: String,
        required: false,
    },
    link: {
        type: String,
        required: false,
    },
    avatar: {
        type: String,
    },
    cover_image: {
        type: String,
    },
    blocked_inbox: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            default: []
        }
    ],
    blocked_diary: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            default: []
        }
    ],
    blocked_notiInbox: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            default: []
        }
    ],
    blocked_notiDiary: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            default: []
        }
    ],
});

usersSchema.index({phonenumber: 'text'});
usersSchema.set('timestamps', true);
module.exports = mongoose.model('Users', usersSchema);
