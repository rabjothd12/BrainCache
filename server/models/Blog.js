const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    content: {
        type: String,
    },
    image: {
        type: String,
    },
    category: {
        type: String,
    },

    isDraft: {
        type: Boolean,
        default: true
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }

}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);