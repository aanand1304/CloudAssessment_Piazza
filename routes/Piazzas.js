const express = require('express')
const router = express.Router()


const User = require('../models/UserSchema')
const Piazza = require('../models/PiazzaSchema')
const verifyToken = require('../verifyToken')
const Post = require('../models/PiazzaSchema')

//I am post portion of the code use for to post....localhost:3000/app/post/
router.post('/post/create', verifyToken, async (req, res) => {
    try {
        //// taking input from user 
        const { post_title, post_topics, post_body,  userExpirationTimeInMinutes } = req.body

        // /Based on user input, we are calculating expiration time and current user details.

        /// calculate expiration time based on current date/time
        const currentTime = new Date()
        const expirationTime = new Date(currentTime.getTime() + userExpirationTimeInMinutes * 60 * 1000)

        // / We are using hre token information to get posting user ID
        const { _id: post_owner, username } = req.user

        const newPost = new Piazza({
            post_title,
            post_topics,
            post_body,
            post_owner,
            post_expirationTime: expirationTime
        })

        ///////Save the post to the database
        const savedPost = await newPost.save()

        res.status(201).send(savedPost)
    } catch (err) {
        res.json({ message: err })
    }
})
////////Find all the post to get all teh post
router.get('/posts',verifyToken, async(req,res) =>{
    try{
        const allPosts = await Piazza.find() // it will find all the post and store it in allPosts
        res.send(allPosts)
    }catch(err){
        res.send({message:err})
    }
})
////Post by ID
router.get('/post/:postId',verifyToken, async(req,res) =>{
    try{
        const getPostById = await Piazza.findById(req.params.postId) //instead of find we can user findByID for specific post
        res.send(getPostById)
    }catch(err){
        res.send({message:err})
    }
})


//I am just checking if post is expired or not --Middleware to check if post is expired or not
const checkPostExpiration = async (req, res, next) => {
    const postId = req.params.postId
    const userId = req.params.userId

    try {
        const post = await Piazza.findById(postId)

        if (post.post_status === 'Live' && post.post_expirationTime < new Date()) {
            // Post is expired
            post.post_status = 'Expired'
            await post.save()
            return res.status(400).json({ message: "Post has been expired. You can't like/dislike/comment on the post." })
        }

        if (post.post_status === 'Expired') {
            // Post is already expired
            return res.status(400).json({ message: "Post has been expired. You can't like/dislike/comment on the post." })
        }

        next()
    } catch (err) {
        res.json({ message: err })
    }
}


//I am use for liking the post/post/like/:postId
router.post('/post/like/:postId', verifyToken, checkPostExpiration, async (req, res) => {
    const { postId } = req.params
    const userId = req.user._id

    // /////Check if the post with the given postId exists
    const existingPost = await Piazza.findById(postId)

    ///// Check if the post doesn't exist
    if (!existingPost) {
        return res.status(404).json({ message: 'Post not found' })
    }

    /// //// Check if login user is the owner of the post
    if (existingPost.post_owner.equals(userId)) {
        return res.status(400).json({ message: 'A post owner cannot like their messages.' })
    }

    // Check if the user with the given userId exists
    const existingUser = await User.findById(userId)
    if (!existingUser) {
        return res.status(404).json({ message: 'User not found' })
    }

    /// Check if the user has already liked the post
    if (existingPost.post_likedBy.includes(userId)) {
        return res.status(400).json({ message: 'You have already liked this post' })
    }

    try {
        /// If the user has disliked the post, remove the dislike
        if (existingPost.post_dislikedBy.includes(userId)) {
            existingPost.post_dislikedBy.splice(existingPost.post_dislikedBy.indexOf(userId), 1)
            existingPost.post_dislikes -= 1
        }

        /// Add  like
        existingPost.post_likedBy.push(userId)
        existingPost.post_likes += 1

        //// Save the updated post.
        const updatedPost = await existingPost.save()

        res.status(200).json({ message: 'Post like status updated successfully', updatedPost })
    } catch (err) {
        res.json({ message: err.message })
    }
})


// //I am route for diliking the post , use localhost:3000/app/post/dislike/PostID/UserID
router.post('/post/dislike/:postId',verifyToken,checkPostExpiration, async (req, res) => {
    const { postId } = req.params
    const userId = req.user._id
    const existingPost = await Piazza.findById(postId)

    try {
        //. Check if the post with the given postId exists

        const postOwner = existingPost.post_owner
        console.log('postOwner:', postOwner)
        console.log(userId)

        // // /Check if the user is the owner of the post
         if (existingPost.post_owner && existingPost.post_owner.toString() === userId) {
            return res.status(400).json({ message: 'Its your post, you cant dislike it' })
        }   

        if (!existingPost) {
            return res.status(404).json({ message: 'Post not found' })
        }

        ///Check if the user with the given userId exists
        const existingUser = await User.findById(userId)
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' })
        }

        // /Check if the user has already disliked the post
        if (existingPost.post_dislikedBy.includes(userId)) {
            return res.status(400).json({ message: 'You have already disliked this post' })
        }

        ////// If the user has liked the post, remove the like
        if (existingPost.post_likedBy.includes(userId)) {
            existingPost.post_likedBy.splice(existingPost.post_likedBy.indexOf(userId), 1)
            existingPost.post_likes -= 1
        }

        ///// Add the dislike
        existingPost.post_dislikedBy.push(userId)
        existingPost.post_dislikes += 1

        ///// Saveing the updated post
        const updatedPost = await existingPost.save()

        res.status(200).json({ message: 'Post dislike status updated successfully', updatedPost })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

// //I am teh route for comment on the post , use localhost:3000/app/post/comment/PostID/UserID
router.post('/post/comment/:postId', verifyToken, checkPostExpiration, async (req, res) => {
    const { postId} = req.params
    const userId = req.user._id
    const { commentText } = req.body

    try {
        //// check that commentText is give
        if (!commentText) {
            return res.status(400).json({ message: 'Comment text is required.' })
        }

        // Check if  post with the given postId present
        const existingPost = await Piazza.findById(postId)
        if (!existingPost) {
            return res.status(404).json({ message: 'Post not found' })
        }

        // use $push to auto update the arrays
        await existingPost.updateOne({
            $push: {
                post_comments: commentText,
                post_commentBy: userId
            },
        })

        // //recieved the updated post
        const updatedPost = await Piazza.findById(postId)

        res.status(201).json({ message: 'Comment added successfully', updatedPost })
    } catch (err) {
        res.json({ message: err })
    }
})


//I am the route for browse data based on topic --/post/browse/'Health'

router.get('/posts/browse/:topics', verifyToken, async (req, res) => {
    // .//Extract and validate topics
    const topics = req.params.topics.split(',').map(topic => topic.trim())
  
    /// check topics against allowed value (Politics, Health, Sport, Tech)
    const allowedTopics = ['Politics', 'Health', 'Sport', 'Tech']
    const isValidTopics = topics.every(topic => allowedTopics.includes(topic))
  
    //// If topics  invalid, return an error 
    if (!isValidTopics) {
      return res.status(400).json({ error: 'Invalid topics specified.' })
    }
  
    try {
      // //Query posts based on topics
      const posts = await Piazza.find({ post_topics: { $all: topics } })
  
      // Return the posts in the response
      res.json(posts)
    } catch (err) {
        res.json({ message: err })
      }
  })

  //I am the route for browse topic data based on post_status  live
// Route to fetch posts with a specific status (e.g., 'Live')
router.get('/browse/liveTopics/:topics',verifyToken, async (req, res) => {
    const requestedTopics = req.params.topics.split(',').map(topic => topic.trim())
  
    try {
      const livePosts = await Piazza.find({ post_status: 'Live', post_topics: { $all: requestedTopics } })
  
      res.json(livePosts)
    } catch (err) {
      res.json({ message: err })
    }
  })


/// Route to fetch posts which are expired
router.get('/posts/browse/expireTopics/:topics', verifyToken, async (req, res) => {
    const requestedTopics = req.params.topics ? req.params.topics.split(',').map(topic => topic.trim()) : []

    try {
        // Query live posts based on specified topics
        const expirePost = await Piazza.find({ post_status: 'Expired', post_topics: { $all: requestedTopics } })

        res.json(expirePost)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})


  ///Highesh post likes
router.get('/highestLikes/:userId', verifyToken, async (req, res) => {
    try {
        // Query the post with the highest likes
        const posts = await Piazza.findOne().sort({ post_likes: -1 }).limit(10)

        res.json(posts)
    } catch (err) {
        res.json({ message: err })
    }
})

//  ///Highest post dislikes
router.get('/highestDislikes/:userId', verifyToken, async (req, res) => {
    try {
        // Query the post with the highest likes
        const posts = await Piazza.findOne().sort({ post_dislikes: -1 }).limit(10)
        res.json(posts)
    } catch (err) {
        res.json({ message: err })
    }
})
  ///Highesh post likes browse all post 
router.get('/browse/byHighestLikes/:userId', verifyToken, async (req, res) => {
    try {
        // Query the post with the highest likes
        const posts = await Piazza.find().sort({ post_likes: -1 }).limit(10)

        res.json(posts)
    } catch (err) {
        res.json({ message: err })
    }
})

//  ///highesetpost dislikes- browse all posts based o
router.get('/browse/byHighestDislikes/:userId', verifyToken, async (req, res) => {
    try {
        /// Query the post with the highest likes
        const posts = await Piazza.find().sort({ post_dislikes: -1 }).limit(10)
        res.json(posts)
    } catch (err) {
        res.json({ message: err })
    }
})
module.exports = router