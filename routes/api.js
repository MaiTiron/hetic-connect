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
    // SI (user connected ET quiz terminée) ==> on affiche tout
    // SI (user )
    mongoose.connect(mongoServer, (err, db) => { // En fonction du déroulement on prend en param soit l'erreur, soit la BDD
    // Test de la connexion
    if (err) { res.render({error : err})}    // Si y'a une erreur, sa coupe le .connect()
    else { // Connexion établie --> récupère la collection de data

        db.collection('user').find().toArray( (err, collection) => {
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
});

 
    // Afficher un profil 
router.get('/voir-profil/:nom', (req, res) => { // Possibilité de récup l'ID (si jamais y'a 2 Marseille dans la BDD)
    let targetName = req.params.nom;
    if (targetName == 'zebi') { // Seulement si la connexion avec le BDD ne trouve rien
        res.render('voir-profil', {error : 'Désolé mais la personne que vous cherchez n\'existe pas !', data : targetName});
    }
    else {
        // 404 ici dans tous les cas autre que le profil inconnu et le cas où ça marche
        res.render('voir-profil', {data: targetName, error: ''});
    }
    
    
});

    // Afficher un profil sans nom
router.get('/voir-profil/', (req, res) => { 
    res.render('404', {data : 'L\'utilisateur que vous cherchez n\'est pas enregistré sur la plateforme'});
});

    // Inscription
router.get('/inscription', (req, res) => {
    res.render('inscription');
});

    // Connexion
router.get('/connexion', (req, res) => {
    res.render('connexion');
});

    // quiz
router.get('/quiz', (req, res) => {
    // Gérer la connexion à la BDD pour récupérer toutes les questions
    res.render('quiz-inscription', {questions: res});
});



    // Mon compte
router.get('/mon-compte', (req, res) => {
    res.render('mon-compte');
});

    // 404
router.get('/404', (req, res) => {
    res.render('404', {data: res});
});












