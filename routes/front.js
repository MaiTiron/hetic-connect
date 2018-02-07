/*
    Import des composants de la route
*/
const express = require('express');
const router = express.Router();
// const mongoose = require('mongoose');
// const mongoServer = 'mongodb://localhost:27017/blog';

module.exports = router;


/*
    Def des routes
*/
router.get('/', (req, res) => {
    res.render('index');
});