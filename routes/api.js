/*
    Import des composants de la route
*/
const express = require('express');
const router = express.Router();
var User = require('../models/user');
const path = require('path');

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));


    // TODO : Mettre le lien vers la vraie BDD
const mongoServer = 'mongodb://localhost/hetic';

var multer = require('multer')
var upload = multer({ dest: './www/uploads/' })

/*
    Def des routes
*/
/*Fonctions*/
// Fonction pour vérifier  
function loggedIn(req, res, next) {
    // router.get('/:path', function(req, res) {
    if(req.session.userId){
        next();
    }else{
        return res.render('signin');
    }
};



    // Accueil --> Affichage des profils 
router.get('/', loggedIn, (req, res) => {
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
                    res.render('voir-profil', {nom: result[0].nom , profil: result[0].profil , prenom: result[0].prenom , tags: result[0].tags, age: result[0].age , filiere: result[0].filiere, dev: result[0].dev, design: result[0].design, com: result[0].com, parcours: result[0].parcours , description: result[0].description, biographie: result[0].biographie, disponibilites: result[0].disponibilites, realisations: result[0].realisations, contact: result[0].contact, imgURL: result[0].imgURL}); //changer collection
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
router.get('/questionnaire', (req, res) => {
    res.render('questionnaire')
});
    

var storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, './www/uploads')
	},
	filename: function(req, file, callback) {
		callback(null, req.session.userId + path.extname(file.originalname))
	}
})


  // Envoi du questionnaire

router.post('/send-questionnaire', (req, res) => {
    console.log('test', req.body);

    // Ouvrir une connexion sur la base MongoDb
    MongoClient.connect(`mongodb://localhost:27017`, (err, client) =>{
        const db = client.db(`hetic`)

        // Tester la connexion
        if(err){ res.send(err) } 
        else{
            db.collection(`users`, (err, users)=>{
                // Suppriumer la tâche
                users.update({_id: new ObjectId(req.session.userId)}, {
                    $set:{
                        age: req.body.age,
                        filiere: req.body.filiere,
                        parcours: req.body.parcours,
                        contact: [req.body.linkedin, req.body.facebook, req.body.telephone],
                        realisations: [req.body.dribbble, req.body.behance, req.body.instgram, req.body.site],
                        description: req.body.description,
                        affichage: true,
                        disponibilites: req.body.disponibilites,                        
                        dev: req.body.dev,
                        description: req.body.description,
                        com: req.body.com,
                        design: req.body.design,
                        competences: [req.body.com, req.body.dev, req.body.design],
                        imgURL: "../img/default_profill.jpg"
                    }
                    // $set:{filiere: req.body.filiere},
                    // $set:{parcours: req.body.parcours},
                    // $set:{contact: [req.body.linkedin, req.body.facebook, req.body.telephone]},
                    // $set:{realisations: [req.body.dribbble, req.body.behance, req.body.instgram, req.body.site]},
                    // $set:{description: req.body.description},
                    // $set:{biographie: req.body.biographie},
                    // $set:{affichage: true},
                    // $set:{disponibilites: req.body.disponibilites},                    
                    // $set:{dev: req.body.dev},
                    // $set:{description: req.body.description},
                    // $set:{com: req.body.com},
                    // $set:{design: req.body.design},
                    // $set:{competences: [req.body.com, req.body.dev, req.body.design]},
                    // $set:{imgURL: "../img/default_profill.jpg"},
                });
            });
        }
                // Vérification de la commande MongoDb
                if(err){  res.status(500).send(`There was a problem finding the user.`) } 
                else{
                    res.send( console.log(`update`) )
                    // Fermer la connexion à la base MongoDb
                    client.close()
                    return res.render('mon-compte', {user: user});
                }
           
        })            
});

    /*
    User.findById(req.session.userId, (err, user) => {
        // Message d'erreur
        if (err) return res.status(500).send(`There was a problem finding the user.`);
        if (!user) return res.status(404).send(`No user found.`);

        if(user){
            console.log('FIND', user)
            User.update()
        }
    })

    
    var upload = multer({
        storage: storage,
        fileFilter: function(req, file, callback) {
            var ext = path.extname(file.originalname);

            if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg' && ext !== '.PNG') {
                return callback(res.end('Only images are allowed'), null)
            }
            
 
            var profil = "";
 
            if (req.body.com == null){
                req.body.com = [""];
            }
 
            if (req.body.dev == null){
                req.body.dev = [""];
            }
 
            if (req.body.design == null){
                req.body.design = [""];
            }
 
            if (req.body.com === Array && req.body.com.length >= req.body.dev.length && req.body.com.length >= req.body.design.length) {
                profil += "Communication";
            } else if (req.body.dev === Array && req.body.dev.length >= req.body.com.length && req.body.dev.length >= req.body.design.length) {
                profil += "Devellopeur";
            } else if (req.body.design === Array && req.body.design.length >= req.body.com.length && req.body.design.length >= req.body.dev.length) {
                profil += "Designer";
            } else ( profil = "");    
            
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
                dev: req.body.dev,        
                design: req.body.design,        
                com:  req.body.com,        
                competences: [req.body.com, req.body.dev, req.body.design],        
                profil : profil,        
                imgURL: "../uploads/" + req.session.userId + ext        
            };
 
    
 
            // User.findById(req.session.userId).update(userData, function (error, user) {
            //     if (error) {    
            //         return next(error);    
            //     } else {    
            //         console.log(userData);    
            //         return res.render('mon-compte', {user: user});     
            //     }
 
            // });
            
            User.findById(req.session.userId, (err, user) => {
                // Message d'erreur
                if (err) return res.status(500).send(`There was a problem finding the user.`);
                if (!user) return res.status(404).send(`No user found.`);

                if(user){
                    user.update(userData, (err, data) => {
                        if (err) return res.status(500).send(`There was a problem finding the user.`);
                        if (!user) {
                            return res.status(404).send(`No user found.`);
                        }
                        else{
                            console.log('setup', userData);    
                            return res.render('mon-compte', {user: data}); 
                        }

                    })
                }
            })
 


        callback(null, true)
        }
 
    }).single('userFile');
 
    upload(req, res, function(err) {
    })
    */
 




    // DATA     --> Récupération des données user
router.post('/data', (req, res) => {
    mongoose.connect(mongoServer, (err, db) => {
        if (err) { res.json({error : err})}
        else { 
            db.collection('users').find({"affichage": true}).toArray( (err, result) => {
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
                return res.redirect('signin');
            }
        });
    }
});


    // MON COMPTE   --> Affichage des informations personnelles
router.get('/mon-compte', function (req, res, next) {
    // var targetId = req.params.id;
    User.findById(req.session.userId).exec(function (error, user) {
        if (error) {
            return next(error);
        } else {
            if (user === null) {
                var err = new Error('Erreur');
                err.status = 400;
                return next(err);
            } else {
                return res.render('mon-compte', {user: user}); // TODO : On peut pas plutot le faire dans la session ?
            }
        }
    });
});
    

    // INSCRIPTION  --> Inscription d'un utilisateur
router.get('/signup', (req, res) => {
    res.render('signup', {err: null});
});    

// Connexion
router.post('/signin', function (req, res, next) {
    if (req.body.logemail && req.body.logpassword) {
        User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
            if (error) {
                var err = new Error('Mauvaise adresse mail ou mot de passe.');
                err.status = 401;
                return next(err);
            } else {
                req.session.userId = user._id;
                // console.log(userData)
                return res.render('mon-compte', {user: user});
            }
        });
    } else {
        var err = new Error('Remplissez tous les champs.');
        err.status = 400;
        return next(err);
    }
});

    // ENVOI DE L'INSCRIPTION   --> inscription d'un user en base : POST
router.post('/signup', function (req, res, next) {
    
    // Vérification de la validité du mot de passe
    // a faire
    // var check = req.check(req.body.password, "").matches(/(?=.*\d)(?=.*[a-z]).{6,20}/g, "i");
    // console.log(check);

    
    let regex = (/(?=.*\d)(?=.*[a-z]).{6,20}/g, "i");

    req.body.password.analyze = function(value) {
        if(regex.test(value)) {
            next();
        } else {
            return res.render("signup", {err: "Le mot de passe doit contenir"});
        }
    };

    // Vérification pwd et conf pwd
    if (req.body.password !== req.body.passwordVerif) {    
        var err = new Error('Les mots de passe ne correspondent pas.');
        err.status = 400;
        return res.render("signup", {err: err});
    }
    
    // Vérification qu'il y a toute les données de rentrées
    if (req.body.mail && req.body.nom && req.body.prenom && req.body.password) { 
        
        if (checkUserAlreadyKnown(req.body.mail) == false ) {
            console.log("DIdjqskjh");
            return res.render('signup', {mail: req.body.mail, nom: req.body.nom, prenom: req.body.prenom, err: "Cette adresse est déjà utilisée."});
        };
        let userData = {
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
                console.log('SIGNUP', user);
                return res.render('mon-compte', {user: user});
            }
        });

    // Identification de l'user
    } /*else if (req.body.logemail && req.body.logpassword) {
        User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
            if (error) {
                var err = new Error('Mauvaise adresse mail ou mot de passe.');
                err.status = 401;
                return res.render('signup', {err: err});
            } else {
                req.session.userId = user._id;
                return res.redirect('mon-compte');
            }
        });
    } else {
        var err = new Error('Remplissez tous les champs.');
        err.status = 400;
        return res.render('signup', {err: err});
    }*/
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
    
    let lastID = req.body.id_Quest;
    

    mongoose.connect(mongoServer, (err, db) => {    // TODO : Supprimer la connexion à la base
        const quizz = db.collection('quizz');
        if (err) { res.render({error : err})}    // Si y'a une erreur, sa coupe le .connect()
        else {     
            // ENVOYER EN BDD
            var etiquette = req.body.etiquette;

            let userData = {
                tags: [],
            }
            userData.tags.push(etiquette);
            console.log(req.body.etiquette);
            User.findById(req.session.userId).update(userData, function (error, user) {
                console.log(user);
                if (error) {
                    return error;
                } else {
                    return res.render('mon-compte', {user : user});
                }
            });

            if(tab.length > 1) { // PB AVEC TAB []
                let questionAlea = tab[Math.floor(Math.random()*tab.length)];
                tab.splice( tab.indexOf(questionAlea), 1 );
                res.render('quizz', {quest: questionAlea.question, reps: questionAlea.responses, id_Quest: questionAlea._id });
            } else {
                console.log('tableau vide');
                return res.render('mon-compte', {user : user});
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

    // FAQ
    router.get('/faq', (req, res) => {
        res.render('faq', {data: res});
    });

// Suppression profil
router.post('/suppression-profil', (req, res) => {
    let utilisateurCourant = User.findById(req.session.userId);
    console.log(utilisateurCourant);
    User.findById(req.session.userId).remove(User).then(             
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/signin');
            }
        })                
    );        
});




// VOID : Vérifie si le mail est déjà enregistré en base pour quelqu'un
function checkUserAlreadyKnown (mailSubmitted) { 
    let mailToCheck = mailSubmitted.toLowerCase();
    mongoose.connect(mongoServer, (err, db) => {
        if (err) { res.render('404', {error : err})}
        else { 
            db.collection('users').find({"mail": mailToCheck.toString() }).toArray( (err, result) => {  // récupération des utilisateurs avec le même mail
                if (err) { res.render('404', {error : err, data: 'Le service à rencontré un problème'}) }
                else {
                    for (user of result) {
                        if (user.mail.toLowerCase() == mailToCheck) {
                            // console.log('Mail déjà utilisé');
                            break;
                        }
                    }
                    return false;
                }
            });
        };
        db.close();
    });
    return true;
}
module.exports = router;