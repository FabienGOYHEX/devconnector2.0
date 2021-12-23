const express = require('express');
const router = express.Router();

//@Route        GET api/auth
//@desc         Test route
//@accès        Public

router.get('/', (req, res) => { res.send(' Auth route') });

module.exports = router;