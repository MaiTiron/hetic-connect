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


module.exports = router;