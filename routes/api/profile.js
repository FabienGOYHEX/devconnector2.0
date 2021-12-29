const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator')


const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');


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

//@Route        POST api/profile/
//@Desc         Create or update a user profile
//@Statut       Private

router.post(
    '/',
    auth,
    [
        check('status', 'Status is required').not().isEmpty(),
        check('skills', 'Skills is required').not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        // je destrucutres tous les champs présents dans le body de la requette pour les rendreaccessibles directement
        const { company, website, location, bio, status, githubusername, skills, youtube, facebook, twitter, instagram, linkedin } = req.body;

        // Build Profile object
        let profileFields = {}; // je créé un objet vide qui contiendra tous les fields de ma requette 
        profileFields.user = req.user.id; // je définis que l'id du user de lobjet est égal au user.id présent dans la requette
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;
        if (skills) {

            profileFields.skills = skills.split(',').map(skill => skill.trim())//Transforme les skills en array
        }
        // Build Social network object

        profileFields.social = {};// j'nitailise l'objet 'social' dans profileFields  , si je ne ne le fait pas il ser undefined
        if (youtube) profileFields.social.youtube = youtube;
        if (twitter) profileFields.social.twitter = twitter;
        if (facebook) profileFields.social.facebook = facebook;
        if (linkedin) profileFields.social.linkedin = linkedin;
        if (instagram) profileFields.social.instagram = instagram;

        try {
            let profile = await Profile.findOne({ user: req.user.id })// Je vérifie s'il y a bien un profile exixtant via le user id contenu dans la requette
            if (profile) { //UPDATE //  Si tu trouves un profil, tu l'update
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },// tu update en fonction de l'id correspondant au user.id contenu dans la requette
                    { $set: profileFields }, // Tu lui passes les éléments contenus dans productFields
                    { new: true }
                );
                return res.json(profile)
            }
            // CREATE // Si tu ne trouves pas de profil correspondant, tu le créé
            profile = new Profile(profileFields)
            await profile.save()
            res.json(profile)

        } catch (err) {
            console.error(err.message)
            res.status(500).send('Servor Errors')
        }

    }
);

//@Route        GET api/profile/
//@Desc        Get all profiles
//@Statut       Public

router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar'])
        res.json(profiles)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('server error')
    }
})

//@Route        GET api/profile/user/:user_id
//@Desc        Get profile by user ID
//@Statut       Public

router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar'])
        if (!profile) return res.status(500).json({ msg: 'There is no profile for this user' });
        res.json(profile)
    } catch (err) {
        console.error(err.message)
        if (err.kind == 'ObjectId') //le.kind permet de comparer le type d'erreur et d'apporte un log erreur différent en fonction
            return res.status(500).json({ msg: 'Profile not found' }) // Si jamais le user id n'est pas trouvé, cela permet de renvoyer profile nto found au lieu de server error
        res.status(500).send('Server Error')
    }
})
//@Route        DELETTE api/profile/user/:user_id
//@Desc        Delette profile, user & post
//@Statut       Private

router.delete('/', auth, async (req, res) => {
    try {
        //@todo remove user post
        //Remove Profile
        await Profile.findOneAndRemove({ user: req.user.id })
        //Remove User
        await Profile.findOneAndRemove({ _id: req.user.id })
        res.json({ msg: 'User Removed' })
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

//@Route        PUT api/profile/experience/
//@Desc        Add profile experience
//@Statut       Private

router.put('/experience', [auth, [
    check('title', 'Title is required').notEmpty(),
    check('company', 'Company i required').notEmpty(),
    check('from', 'From date is required').notEmpty()
]], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const { title, company, location, from, to, current, description } = req.body;// Je destructure les éléments de la requette
    // je créé l'objet newExp avec les champs extraits de la requette
    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }
    try {
        const profile = await Profile.findOne({ user: req.user.id });// je trouve le profil correspondant à la requette
        profile.experience.unshift(newExp)// je lui push l'objet newExp

        await profile.save()// je sauvegarde en bbd les nouveaux éléments contenus dans l'objet new Exp
        res.json(profile)

    } catch (err) {
        console.error(err.message)
        rest.status(500).send('Server Error')
    }
})
//@Route        DELETTE api/profile/experience/exp_id
//@Desc        Delette experience from profile
//@Statut       Private

router.delete('/experience/:exp_id', auth, async (req, res) => {
    try { // je récupère le profil correspondant à la requette en bdd
        const profile = await Profile.findOne({ user: req.user.id })
        // Je récupère L'id ave le.map et le compare avec celui contenu dans l'url de la requtte avec indexOf
        const removeIndex = await profile.experience.map(item => item.id).indexOf(req.params.exp_id)

        profile.experience.splice(removeIndex, 1)
        await profile.save(),
            res.json(profile)

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }

})
module.exports = router