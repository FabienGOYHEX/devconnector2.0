const express = require('express');
const router = express.Router();
const config = require('config');
const { check, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const auth = require('../../middleware/auth');
const User = require('../../models/User');


//@Route        GET api/auth
//@desc         Test route
//@accès        Public

// Première route pour tester son fonctionnement de manière simple
//Le fait de rajouter le auth qui corrspond à notre middleware protège la route 
//router.get('/', auth, (req, res) => { res.send(' Auth route') });

//RECUPERATION DES DONNEES DE L'UTILISATEUR CONECTÉ

router.get('/', auth, async (req, res) => {
    try {//Ici je récupère le user connecté grace à la fonction findbyId en lui passant la valeur présente dans la requette - le password
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error')
    }
})
// CONNECTION DE L'UTILISATEUR 
// @route       POST api/auth
// @desc        Authentificate User & get token
// @Accès       Public


router.post('/', [
    // Je check si c'est bien un email et si le password existe
    check(
        'email',
        'Email is required',
    ).isEmail(),
    check(
        'password',
        'Password is required',
    ).exists()
],      //Je gèreles éventuelles erreurs
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        // Je récupère le mail et le password de la requète
        const { email, password } = req.body;

        try {   // J evérifie que l'email corresponde bien à un compte 
            let user = await User.findOne({ email })
            if (!user) {
                return res.status(400).json({ erors: [{ msg: 'User does not exists' }] });
            }

            //decript/ Compare the password 

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ errors: [{ msg: 'Invalid password ' }] })
            }
            const payload = {
                user: {
                    id: user.id
                }
            };
            jwt.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: 3600000 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token })
                }
            )

        } catch (err) {
            console.error(err.message)
            res.status(500).send('Server Error !')
        }
    })


module.exports = router;