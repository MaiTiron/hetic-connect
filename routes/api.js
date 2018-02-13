/*
    Import des composants de la route
*/
const express = require('express');
const router = express.Router();
var User = require('../models/user');


const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));



    // TODO : Mettre le lien vers la vraie BDD
const mongoServer = 'mongodb://localhost/hetic';



/*
    Def des routes
*/
    // INDEX    --> Affichage des profils 
router.get('/', (req, res) => {
    // SI (user connected ET quiz terminée) ==> on affiche tout
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

    
    // Afficher un profil sans nom
router.get('/voir-profil/', (req, res) => { 
    res.render('404', {data : 'L\'utilisateur que vous cherchez n\'est pas enregistré sur la plateforme'});
});


    // PROFIL   --> Affichage d'un profil utilisateur
router.get('/voir-profil/:id', (req, res) => { // Possibilité de récup l'ID (si jamais y'a 2 Marseille dans la BDD)   
    var targetId = req.params.id;
    mongoose.connect(mongoServer, (err, db) => {
        
        if (err) { res.json({error : err})}    // Si y'a une erreur, sa coupe le .connect()
        else { 
            db.collection('users').find({"_id": ObjectId(targetId) }).toArray( (err, result) => {
                console.log('Voir User : ' + result);
                if (err) { res.json({error : err}) }
                else {
                    res.render('voir-profil', {nom: result[0].nom , prenom: result[0].prenom , tags: result[0].tags, age: result[0].age , filiere: result[0].filiere, competences: result[0].competences, parcours: result[0].parcours , description: result[0].description, biographie: result[0].biographie, disponibilites: result[0].disponibilites, realisations: result[0].realisations, contact: result[0].contact}); //changer collection
                }
            });
        };
        db.close();
    });
});


    // Questionnaire
router.get('/questionnaire', (req, res) => {
        res.render('questionnaire')
});
    
        // Envoi du questionnaire
router.post('/send-questionnaire', (req, res) => {
    var userData = {
        age: req.body.age,
        filiere: req.body.filiere,
        parcours: req.body.parcours,
        contact: [req.body.linkedin, req.body.facebook, req.body.telephone],
        realisations: [req.body.dribbble, req.body.behance, req.body.instagram, req.body.site],
        description: req.body.description,
        biographie: req.body.biographie,
        affichage: true,
        disponibilites: req.body.disponibilites,
        competences: [req.body.competences]
    };
    User.findById(req.session.userId).update(userData, function (error, user) {
        console.log(userData);
        if (error) {
            return next(error);
        } else {
            return res.redirect('mon-compte');
        }
    });
});
    // DATA     --> Récupération des données user
router.post('/data', (req, res) => {
    mongoose.connect(mongoServer, (err, db) => {
        if (err) { res.json({error : err})}
        else { 
            db.collection('users').find({"affichage": true}).toArray( (err, result) => {
                console.log({result});
                if (err) { res.json({error : err}) }
                else {
                    res.json({data : result}); //changer de collection
                }
            });
        };
        db.close();
    });
});


    // CONNEXION    --> Connexion d'un utilisateur
router.get('/signin', (req, res) => {
    res.render('signin');
});
    

// DÉCONNEXION    --> Suppression de la session active
router.get('/logout', function (req, res, next) {
    if (req.session) {
        // Supprime session
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('inscription');
            }
        });
    }
});


    // MON COMPTE   --> Affichage des informations personnelles
router.get('/mon-compte', function (req, res, next) {
    User.findById(req.session.userId).exec(function (error, user) {
        if (error) {
            return next(error);
        } else {
            if (user === null) {
                var err = new Error('Erreur');
                err.status = 400;
                return next(err);
            } else {
                // Remplacer par route sur laquelle il faut rediriger une fois connecté
                return res.render('mon-compte', {nom: user.nom, prenom: user.prenom, mail: user.mail}); // TODO : On peut pas plutot le faire dans la session ?
            }
        }
    });
});
    

    // INSCRIPTION  --> Inscription d'un utilisateur
router.get('/signup', (req, res) => {
    res.render('signup');
});    


    // ENVOI DE L'INSCRIPTION   --> inscription d'un user en base : POST
router.post('/signup', function (req, res, next) {
    // Vérification pwd et conf pwd
    if (req.body.password !== req.body.passwordVerif) {    
        var err = new Error('Les mots de passe ne correspondent pas.');
        err.status = 400;
        return next(err);
    }
        // TODO : Vérifier que ça existe pas déja dans la base
    if (req.body.mail && req.body.nom && req.body.prenom && req.body.password) {
        var userData = {
            mail: req.body.mail,
            nom: req.body.nom,
            prenom: req.body.prenom,
            password: req.body.password
        };
        User.create(userData, function (error, user) {
            if (error) {
                return next(error);
            } else {
                req.session.userId = user._id;
                res.redirect('mon-compte');
            }
        });
    } else if (req.body.logemail && req.body.logpassword) {
        User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
            if (error || !user) {
                var err = new Error('Mauvaise adresse mail ou mot de passe.');
                err.status = 401;
                return next(err);
            } else {
                req.session.userId = user._id;
                return res.redirect('mon-compte');
            }
        });
    } else {
        var err = new Error('Remplissez tous les champs.');
        err.status = 400;
        return next(err);
    }
});

   
   // DÉMARRER LE QUIZ  --> Page avec bouton de démarrage
router.get('/start-quizz', (req, res) => {
    res.render('start-quizz');
}); 


    // RÉALISER LE QUIZ --> Interface de réponse aux questions du quiz
let tab = [];
let test = false;
router.get('/quizz', (req, res) => {
    console.log('Req.session : ' + req.session);
    mongoose.connect(mongoServer, (err, db) => {
        if (err) { res.render('404', {error : err})}    // Si y'a une erreur, sa coupe le .connect()
        else { 
            db.collection('quizz').find().toArray( (err, collection) => {
                if (err) { res.render('404', {error : err, data: 'Problème dans l\'affichage des questions du quizz'}) }
                else {
                    for (q of collection) {
                        tab.push(q);
                        test = true;
                    }
                    let questionAlea = tab[Math.floor(Math.random()*tab.length)]; 
                    res.render('quizz', {quest: questionAlea.question, reps: questionAlea.responses, id_Quest: questionAlea._id });
                }
            });
        };
        db.close();
    });
});
   

    // ENVOI QUIZ   --> Envoi des données du quiz vers le schema User
router.post('/send-quizz', (req, res) => {
    
    var lastID = req.body.id_Quest;
    console.log(req.session.userId);
    console.log(req.body.etiquette);
    mongoose.connect(mongoServer, (err, db) => {
        const quizz = db.collection('quizz');
        if (err) { res.render({error : err})}    // Si y'a une erreur, sa coupe le .connect()
        else {     
            // SI ON REÇOIT + D'UN 1 _ID ON AJOUTE DANS LA REQUETE
            if(tab.length > 1) {
                let questionAlea = tab[Math.floor(Math.random()*tab.length)];
                tab.splice( tab.indexOf(questionAlea), 1 );
                res.render('quizz', {quest: questionAlea.question, reps: questionAlea.responses, id_Quest: questionAlea._id });
            } else {
                console.log('tableau vide');
                res.render('404', {data: 'La page de retour n\'est pas encore dev !'});
            }
        }
        db.close();
    });
});


    // Test de la variable de session
router.get('/clear', function(req, res) {  
    res.send(req.session);
});


    // 404
router.get('/404', (req, res) => {
    res.render('404', {data: res});
});


module.exports = router;
