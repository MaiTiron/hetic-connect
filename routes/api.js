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
    // Afficher un profil 
router.get('/voir-profil/:nom', (req, res) => {
    console.log(req.params.nom);
    res.render('voir-profil/?'+req.params.nom);
});


    // Mon compte
router.get('/mon-compte', (req, res) => {
    res.render('mon-compte');
});