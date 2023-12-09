const mongoose = require('mongoose')


const piazzaSchema = mongoose.Schema({
    post_title: {
        type: String,
        required: true,
    },
    post_topics: {
        type: [String],
        required: true,
    },
    post_time: {
        type: Date,
        default: Date.now,
    },
    post_body: {
        type: String,
        required: true,
    },
    post_expirationTime: {
        type: Date,
        required: true,
        //default: () => Date.now() + 2 * 60 * 60 * 1000, //setting default to 2 hrs
    },
    post_status: {
        type: String,
        enum: ['Live', 'Expired'],
        default: 'Live',
    },
    post_owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default:null,
    },
    post_likes: {
        type: Number,
        default: 0,
    },
    post_dislikes: {
        type: Number,
        default: 0,
    },
    post_comments: [
        {
            type: String,
            required: true,
        },
    ],
    post_likedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    ],
    post_dislikedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    ],
    post_commentBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    ],
});
module.exports =mongoose.model('Piazza',piazzaSchema)