/*
    Import des composants de la route
*/
const express = require('express');
const router = express.Router();
var User = require('../models/user');


const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;
// module.exports = router;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));



// const mongoServer = 'mongodb://localhost:27017/hetic'; // Mettre le lien vers la vraie BDD ?
const mongoServer = 'mongodb://localhost/hetic';



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
                
                res.render('index');
            }
        });
    };
    db.close();
});
});

router.post('/data', (req, res) => {
    mongoose.connect(mongoServer, (err, db) => { // En fonction du déroulement on prend en param soit l'erreur, soit la BDD
    // Test de la connexion
    if (err) { res.json({error : err})}    // Si y'a une erreur, sa coupe le .connect()
    else { // Connexion établie --> récupère la collection de data

        db.collection('users').find({"affichage": "true"}).toArray( (err, result) => {
            // Test la connexion à la collection
            console.log({result});
            if (err) { res.json({error : err}) }
            else {
                res.json({data : result}); //changer collection
            }
        });
    };
    db.close();
});

});


 
    // Afficher un profil 
router.get('/voir-profil/:id', (req, res) => { // Possibilité de récup l'ID (si jamais y'a 2 Marseille dans la BDD)   
var targetId = req.params.id;
mongoose.connect(mongoServer, (err, db) => { // En fonction du déroulement on prend en param soit l'erreur, soit la BDD
// Test de la connexion
if (err) { res.json({error : err})}    // Si y'a une erreur, sa coupe le .connect()
else { // Connexion établie --> récupère la collection de data
    db.collection('users').find({"_id": ObjectId(targetId) }).toArray( (err, result) => {
        // Test la connexion à la collection
        console.log(result);
        if (err) { res.json({error : err}) }
        else {
            console.log(result[0].realisations);
            res.render('voir-profil', {nom: result[0].nom , prenom: result[0].prenom , tags: result[0].tags, age: result[0].age , filiere: result[0].filiere, competences: result[0].competences, parcours: result[0].parcours , description: result[0].description, biographie: result[0].biographie, disponibilites: result[0].disponibilites, realisations: result[0].realisations, contact: result[0].contact}); //changer collection
        }
    });
};
    db.close();
    });
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

    







    // quizz
    let tab = [];
    let test = false;
router.get('/quizz', (req, res) => {

    mongoose.connect(mongoServer, (err, db) => {
        if (err) { res.render('404', {error : err})}    // Si y'a une erreur, sa coupe le .connect()
        else { 
            db.collection('quizz').find().toArray( (err, collection) => {
                if (err) { res.render('404', {error : err, data: 'Problème dans l\'affichage des questions du quizz'}) }

                else {
                    console.log(collection);
                        for (q of collection) {
                            tab.push(q);
                            test = true;
                        }
                    
                    console.log(tab.length);
                    let questionAlea = tab[Math.floor(Math.random()*tab.length)]; 
                    res.render('quizz', {quest: questionAlea.question, reps: questionAlea.responses, id_Quest: questionAlea._id });
                }
            });
        };
        db.close();
    });
});
    
    // quizz
router.post('/send-quizz', (req, res) => {
    
    var lastID = req.body.id_Quest;
    console.log(req.session.userId);
    app.use(session({
        genid: function(req) {
          return genuuid() // use UUIDs for session IDs
        },
        secret: 'keyboard cat'
    }))

    mongoose.connect(mongoServer, (err, db) => {
        const quizz = db.collection('quizz');
        if (err) { res.render({error : err})}    // Si y'a une erreur, sa coupe le .connect()
        else { 
            
            // SI ON REÇOIT 2 _ID ON AJOUTE DANS LA REQUETE
            
                if(tab.length > 1) {
                    let questionAlea = tab[Math.floor(Math.random()*tab.length)];
                    tab.splice( tab.indexOf(questionAlea), 1 );
                    console.log('tab : ' + tab + ' --------- length Tab : ' + tab.length);
                   
                    
                    console.log('ID prochaine : ' + questionAlea._id);
                    
                   
                    res.render('quizz', {quest: questionAlea.question, reps: questionAlea.responses, id_Quest: questionAlea._id });
                } else {
                    console.log('tableau vide bande de fdp');
                    res.render('404', {data: 'La page de retour n\'est pas encore dev !'});
                }
            
        }

        db.close();
    });
});

    // Mon compte
router.get('/mon-compte', (req, res) => {
    res.render('mon-compte');
});

    // 404
router.get('/404', (req, res) => {
    res.render('404', {data: res});
});


module.exports = router;