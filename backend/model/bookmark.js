const mongoose = require('mongoose');

const bookmark = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },

    userName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    bookmarks: [
        {
            siteName: {
                type: String,
                required: true,
                trim: true
            },

            siteURL: {
                type: String,
                required: true,
                trim: true
            },

            siteLogo: {
                type: String,
                default: ""
            }
        }
    ]

}, { timestamps: true });

const bookmarkSchema = mongoose.model("Bookmark", bookmark);

module.exports = bookmarkSchema;