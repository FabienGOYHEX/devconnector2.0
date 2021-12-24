const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const User = require('../../models/User')
const config = require('config')


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
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ MyErrors: errors.array() })
        }


        const { name, email, password } = req.body;

        try {
            // See if user exist

            let user = await User.findOne({ email })
            if (user) {
                // res.status(400).send('User already exists')//Ma manière de gérer l'erreur (sans le return avant res.statut une erreur console apparait)le return est obligatoire pour éviter l'erreur console si ce n'est pas la dernière erreur que l'on gère
                return res.status(400).json({ errors: [{ 'msg': 'User already exists' }] })// Méthode recommandée (avec le return avant res.statut as d'erreurs console)
            }

            // Get users gravatar
            const avatar = gravatar.url(email, {
                s: '20',
                r: 'pg',
                d: 'mm'
            })
            // Je créé le nouvel utilisateur en Bdd
            user = new User({
                name,
                email,
                avatar,
                password
            })

            //Encrypt password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt)

            await user.save();// avec cette fonction j'enregistre l'utilisateur en base de donnée



            // Return JsonWebToken

            const payload = {
                user: {
                    id: user.id // ici je récupère l'id du user enregistré en bdd
                }
            }

            jwt.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: 3600000 },//gère le délais d'xpiration du token
                (err, token) => {
                    if (err) throw err;// gère l'ereur si il y en a une
                    res.json({ token })// sinon il renvoit le token sous format Json
                }
            )


            //res.send('User registered')

        } catch (err) {
            console.error(err.message);
            res.status(500).send(' Serveur Error') // ici on ne met pas le return avant res.statut car il s'agit du dernier point de terminaison(dernière erreur que l'on gère)
        }

    }
);

module.exports = router;