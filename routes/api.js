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

const mongoServer = 'mongodb://localhost:27017/todolist';


/*
    Def des routes
*/
    // Afficher les tâches EN COURS
router.get('/', (req, res) => {
    mongoose.connect(mongoServer, (err, db) => { // En fonction du déroulement on prend en param soit l'erreur, soit la BDD
        // Test de la connexion
        
        if (err) { res.render({error : err})}    // Si y'a une erreur, sa coupe le .connect()
        else { 
            // Connexion établie --> récupère la collection de data
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
});

// Ajouter une task en cours
router.post('/add-task', (req, res) => {
    mongoose.connect(mongoServer, (err, db) => { // En fonction du déroulement on prend en param soit l'erreur, soit la BDD
        // Test de la connexion
        if (err) { res.render('index', {error : err})}    // Si y'a une erreur, sa coupe le .connect()
        else {
            db.collection('tasks').insert({
                title: req.body.title,
                state: true
            }, ( err, newObject ) => {
                if ( err ) {
                    res.render('add-task', {error: err});
                } else {
                    res.redirect(301, "/api");
                }
            });
        };
        db.close();
    });
});

// Supprimer une task
router.post('/suppr-task/:id', (req, res) => {
    console.log(req.params.id);
    mongoose.connect(mongoServer, (err, db) => { // En fonction du déroulement on prend en param soit l'erreur, soit la BDD
        // Test de la connexion
        if (err) { res.render('index', {error : err})}    // Si y'a une erreur, sa coupe le .connect()
        else {
            db.collection('tasks').remove({
                _id: ObjectId(req.params.id)
            }, ( err, newObject ) => {
                if ( err ) {
                    res.render('suppr-task', {error: err});
                } else {
                    res.redirect(301, "/api");
                }
            });
        };
        db.close();
    });
});


// Afficher un profil 
router.get('/voir-profil/:nom', (req, res) => {
    console.log(req.params.id);
    res.render('voir-profil');
});


// Mon compte
router.get('/mon-compte', (req, res) => {
    res.render('mon-compte');
});