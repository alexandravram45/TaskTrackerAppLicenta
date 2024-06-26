const mongoose = require('mongoose');
const BlacklistSchema = new mongoose.Schema(
    {
        token: {
            type: String,
            required: true,
            ref: "User",
        },
    },
    { timestamps: true }
);
const BlackList = mongoose.model("blacklist", BlacklistSchema);
module.exports = BlackList