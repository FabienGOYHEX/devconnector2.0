const express = require('express');
const router = express.Router();


const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile')
const User = require('../../models/User')


//@Route        GET api/profile/me
//@Desc         Get current user profile
//@Statut       Private

router.get('/me', auth, async (req, res) => {
    try {           // la fonction populate viens de monggose et permet de lier des éléments en commun de deux tables différentes en bdd
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

        if (!profile) {
            return res.status(400).json({ msg: "There is no profile for this user " })
        }
        res.json(profile)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Serveur Error')
    }
})

module.exports = router