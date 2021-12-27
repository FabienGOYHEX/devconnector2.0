const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = function (req, res, next) { // ici la foncton étant un middleware on retrouve une requette(req), une réponse(res) et next qui permet de passer à la suite

    // Get token from header
    const token = req.header('x-auth-token');// ici on demande la valeur contenue dans la clé x-auth-token dans le header de la requette 
    // Check if not token
    if (!token) {
        return res.status(401).json({ msg: 'No Token, autorisation denied ' })
    }
    // Verify token 
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'))// jwt.verify est une fonction de jsonwebtoken qui permet de vérifier le token, on y passe 2valeurs, le token récupéré dans la requette plus haut et le Secrettoken récupéré dans config
        // En dessous je vérifie si le user dans la requette est le même de que le user décodé
        req.user = decoded.user;// je récupère l'objet user qui est définit dans le jwt / il est configuré dans le payload dans le fichier users.js, il correspond à l'id du user enregistré en bdd et je le compare au user décodé 
        next()
    } catch (err) {
        res.staus(401).json({ msg: 'token is not valid ' })
    }
}