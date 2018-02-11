/*
    Import des composants de la route
*/
const express = require('express');
const router = express.Router();
var User = require('../models/user');

// const mongoose = require('mongoose');
// const mongoServer = 'mongodb://localhost:27017/blog';



/*
    Def des routes
*/
router.get('/', (req, res) => {
    res.render('index');
});



// Page inscription : GET
router.get('/inscription', (req, res) => {
    res.render('inscription');
  });
  
  
  // Page inscription : POST
  router.post('/inscription', function (req, res, next) {
  
    if (req.body.password !== req.body.passwordVerif) {
      var err = new Error('Les mots de passe ne correspondent pas.');
      err.status = 400;
      // res.send("Le mot de passe ne correspond pas.");
      return next(err);
    }
  
    
  
    if (req.body.email &&
      req.body.username &&
      req.body.password) {
  
      var userData = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
      }
  
      User.create(userData, function (error, user) {
        if (error) {
          return next(error);
        } else {
          req.session.userId = user._id;
          return res.redirect('/profile');
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
          return res.redirect('/profile');
        }
      });
    } else {
      var err = new Error('Remplissez tous les champs.');
      err.status = 400;
      return next(err);
    }
  })
  
  // Page profil : GET
  router.get('/profile', function (req, res, next) {
    User.findById(req.session.userId)
      .exec(function (error, user) {
        if (error) {
          return next(error);
        } else {
          if (user === null) {
            var err = new Error('Erreur');
            err.status = 400;
            return next(err);
          } else {
            // Remplacer par route sur laquelle il faut rediriger une fois connecté
            return res.send('<h1>Nom: </h1>' + user.username + '<h2>Mail: </h2>' + user.email + '<br><a type="button" href="/logout">Déconnexion</a>')
          }
        }
      });
  });
  
  // Page déconnexion : GET
  router.get('/logout', function (req, res, next) {
    if (req.session) {
      // Supprime session
      req.session.destroy(function (err) {
        if (err) {
          return next(err);
        } else {
          return res.redirect('/inscription');
        }
      });
    }
  });




  module.exports = router;
