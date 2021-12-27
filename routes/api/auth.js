const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const User = require('../../models/User')

//@Route        GET api/auth
//@desc         Test route
//@accès        Public

// Première route pour tester son fonctionnement de manière simple
//Le fait de rajouter le auth qui corrspond à notre middleware protège la route 
//router.get('/', auth, (req, res) => { res.send(' Auth route') });

router.get('/', auth, async (req, res) => {
    try {//Ici je récupère le user connecté grace à la fonction findbyId en lui passant la valeur présente dans la requette - le password
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error')
    }
})

module.exports = router;