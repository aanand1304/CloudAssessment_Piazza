const express = require('express')
const router = express.Router()

const User = require('../models/UserSchema')
const Piazza = require('../models/PiazzaSchema')
const verifyToken = require('../verifyToken')
const Post = require('../models/PiazzaSchema')

router.post('/', verifyToken, async (req, res) => {
        const newPost = new Piazza({
            post_title: req.body.post_title,
            post_topics: req.body.post_topics,
            post_body: req.body.post_body,
            post_owner: req.body.post_owner
        })
    
    try{
        const postToSave = await newPost.save()
        res.send(postToSave);
    } catch (err) {
        res.status(400).send({message:err})
    }
})

router.get('/',verifyToken, async (req, res) => {
    try {
        const getPosts = await Piazza.find().limit(10)
        res.send(getPosts)
    } catch (err) {
        res.send({message:err})

    }
});
router.get('/:postId',verifyToken, async(req,res) =>{
    try{
        const getPostById = await Piazza.findById(req.params.postId)
        res.send(getPostById)
    }catch(err){
        res.send({message:err})
    }
})

///check post expiration
// Middleware to check post expiration
// Middleware to check post expiration
const checkPostExpiration = async (req, res, next) => {
    const postId = req.params.postId; // Assuming postId is passed in the URL

    try {
        const post = await Piazza.findById(postId);

        if (post.post_status === 'Live' && post.post_expirationTime < new Date()) {
            // Post is expired
            post.post_status = 'Expired';
            await post.save();
            return res.status(400).json({ message: "Your post has been expired. You can't like/ dislike/ comment on the post." });
        }

        if (post.post_status === 'Expired') {
            // Post is already expired
            return res.status(400).json({ message: "Your post is already expired. You can't like/ dislike/ comment on the post." });
        }

        next(); // Move to the next middleware
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


// Route for disliking a post
router.post('/dislike/:postId/:userId',verifyToken,checkPostExpiration, async (req, res) => {
    const { postId, userId } = req.params;

    try {
        // Check if the post with the given postId exists
        const existingPost = await Piazza.findById(postId);
        if (!existingPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the user with the given userId exists
        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user has already disliked the post
        if (existingPost.post_dislikedBy.includes(userId)) {
            return res.status(400).json({ message: 'You have already disliked this post' });
        }

        // If the user has liked the post, remove the like
        if (existingPost.post_likedBy.includes(userId)) {
            existingPost.post_likedBy.splice(existingPost.post_likedBy.indexOf(userId), 1);
            existingPost.post_likes -= 1;
        }

        // Add the dislike
        existingPost.post_dislikedBy.push(userId);
        existingPost.post_dislikes += 1;

        // Save the updated post
        const updatedPost = await existingPost.save();

        res.status(200).json({ message: 'Post dislike status updated successfully', updatedPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// Route for liking a post
router.post('/like/:postId/:userId', verifyToken,checkPostExpiration, async (req, res) => {
    const { postId, userId } = req.params;

    try {
        // Check if the post with the given postId exists
        const existingPost = await Piazza.findById(postId);
        if (!existingPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the user with the given userId exists
        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user has already liked the post
        if (existingPost.post_likedBy.includes(userId)) {
            return res.status(400).json({ message: 'You have already liked this post' });
        }

        // If the user has disliked the post, remove the dislike
        if (existingPost.post_dislikedBy.includes(userId)) {
            existingPost.post_dislikedBy.splice(existingPost.post_dislikedBy.indexOf(userId), 1);
            existingPost.post_dislikes -= 1;
        }

        // Add the like
        existingPost.post_likedBy.push(userId);
        existingPost.post_likes += 1;

        // Save the updated post
        const updatedPost = await existingPost.save();

        res.status(200).json({ message: 'Post like status updated successfully', updatedPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/comment/:postId/:userId', checkPostExpiration, async (req, res) => {
    const { postId, userId } = req.params;
    const { commentText } = req.body;

    try {
        // Validate that commentText is provided
        if (!commentText) {
            return res.status(400).json({ message: 'Comment text is required.' });
        }

        // Check if the post with the given postId exists
        const existingPost = await Piazza.findById(postId);
        if (!existingPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Use $push to atomically update the arrays
        await existingPost.updateOne({
            $push: {
                post_comments: commentText,
                post_commentBy: userId,
            },
        });

        // Retrieve the updated post
        const updatedPost = await Piazza.findById(postId);

        res.status(201).json({ message: 'Comment added successfully', updatedPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router
