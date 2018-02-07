/*
    Import des composants de la route
*/
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const ObjectId = require('mongodb').ObjectID;

module.exports = router;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

const mongoServer = 'mongodb://localhost:27017/hetic'; // Mettre le lien vers la vraie BDD ?


/*
    Def des routes
*/
    // Accueil --> Affichage des profils 
router.get('/', (req, res) => {
    
    mongoose.connect(mongoServer, (err, db) => { // En fonction du déroulement on prend en param soit l'erreur, soit la BDD
    // Test de la connexion
        console.log(db.collection('user').find('nom'));
    if (err) { res.render({error : err})}    // Si y'a une erreur, sa coupe le .connect()
    else { // Connexion établie --> récupère la collection de data

        db.collection('tasks').find().toArray( (err, collection) => {
            // Test la connexion à la collection
            if (err) { res.render('index', {error : err, data: 'Aucune tâche en cours'}) }
            else {
                // Connexion à la collection établie
                res.render('index', {data: collection});
            }
        });
    };
    db.close();
});

    console.log(req.body);
});

    // Afficher un profil 
router.get('/voir-profil/:nom', (req, res) => {
    console.log(req.params.nom);
    res.render('voir-profil/?' + req.params.nom);
});


    // Mon compte
router.get('/mon-compte', (req, res) => {
    res.render('mon-compte');
});