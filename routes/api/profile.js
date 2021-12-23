const express = require('express');
const router = express.Router();


//@Route        GET api/profile
//@Desc         Test
//@Statut       Public
router.get('/', (req, res) => { res.send('Profile route') })

module.exports = router