const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator')


const auth = require('../../middleware/auth')
const Post = require('../../models/Post')
const Profile = require('../../models/Profile')
const User = require('../../models/User')



// @Route           POST api/post
// @Desc            Create post
// @Statuts         Private

router.post('/',
    [auth,
        [
            check('text', 'Text is required').notEmpty(),
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() })
        }
        try {
            const user = await User.findById(req.user.id).select('-password');
            const newPost = new Post({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            })
            const post = await newPost.save()
            res.json(post)
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Serveur Error')
        }

    });
// @Route           GET api/post
// @Desc            Get all posts
// @Statuts         Private

router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 })
        res.json(posts)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Serveur Error')
    }
})
module.exports = router;