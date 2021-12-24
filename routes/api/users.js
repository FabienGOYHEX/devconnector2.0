const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');



//@route            POST api/user
//@desc             Register user
//@accès            Public
router.post('/', [
    check(
        'name',
        'Name is required'
    )// native function from express-validator permet de valider un champ en 1er paramètre, de passer un message en 2eme paramètre
        .not().isEmpty(),
    check(
        'email',
        'Email is required'
    ).isEmail(),
    check(
        'password',
        'Please enter a password with 8 or more character'
    ).isLength({ min: 8 })
],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ MyErrors: errors.array() })
        }
        res.send('User route')
    });

module.exports = router;