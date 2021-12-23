const express = require('express');
const router = express.Router();


// @Route           GET api/post
// @Desc            Test 
// @Statuts         Public
router.get('/', (req, res) => { res.send('Post Route') });

module.exports = router;