# plateforme_hetic

##todolist

###1. Connexion BDD --> Afficher du contenu []
```
// AFFICHER DU CONTENU DANS index.ejs
mongoose.connect(mongoServer, (err, db) => { // En fonction du déroulement on prend en param soit l'erreur, soit la BDD
    // Test de la connexion
        
    if (err) { res.render({error : err})}    // Si y'a une erreur, sa coupe le .connect()
    else { // Connexion établie --> récupère la collection de data

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
```


###2. Connexion BDD --> Injecter dans la BDD []
```
// AJOUTER UNE TACHE EN COURS

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
```


###3. Connexion BDD --> Supprimer du contenu []
```
// SUPPRIMER UNE TACHE EN COURS

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
```

###4. Création des pages html pour dev les fonctionnalités []