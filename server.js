/* 
    Import des dépdendances
*/
    // Composants
const express = require('express');
const path = require('path');
const ejs = require('ejs');
const bodyParser = require('body-parser');

/*
    Import des composant pour l'authentification
*/
const session = require('express-session');

    // Modules
// const frontRoute = require('./routes/front');
const apiRoute = require('./routes/api');

/*
Import des composants MongoDB et configuration
*/
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
mongoose.connect('mongodb://127.0.0.1/hetic');
const db = mongoose.connection;


    
/* 
    Initialiser le serveur
*/
    // Config serveur
const app = express();
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

const port = process.env.PORT || 3000;

    // Config dossier des vues clients
app.set('views', __dirname + '/www');
app.use(express.static(path.join(__dirname, 'www')));

app.engine('ejs', ejs.renderFile);
app.set('view engine', 'ejs');

    // Handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () { });





    // Configuration de Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}));

    // Configuration de BodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
    

/*
    Configuration des routes
*/
// app.use('/', frontRoute);
app.use('/', apiRoute);


    // catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('File Not Found');
    err.status = 404;
    next(err);
});
  
    // error handler
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
});




/*
    Lancer le server
*/
app.listen( port, () => console.log(`Le serveur est lancé sur le port ${port}`) );