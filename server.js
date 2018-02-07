/* 
    Import des dépdendances
*/
    // Composants
const express = require('express');
const path = require('path');
const ejs = require('ejs');
    
    // Modules
const frontRoute = require('./routes/front');
const apiRoute = require('./routes/api');
    
    
/* 
    Initialiser le serveur
*/
    // Config serveur
const app = express();
const port = process.env.PORT || 3000;
    
    // Config dossier des vues clients
app.set('views', __dirname + '/www');
app.use(express.static(path.join(__dirname, 'www')));

app.engine('ejs', ejs.renderFile);
app.set('view engine', 'ejs');

app.use('/', frontRoute);
app.use('/api', apiRoute);

/*
    Lancer le server
*/
app.listen( port, () => console.log(`Le serveur est lancé sur le port ${port}`) );