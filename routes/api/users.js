const express = require('express');
const router = express.Router();


//@route            GET api/user
//@desc             Test route
//@accès            Public
router.get('/', (req, res) => { res.send('User route') });

module.exports = router;