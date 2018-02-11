#plateforme_hetic

## Mongodb liste des commande

Lancer le serveur mongodb
```
mongod --dbpath data
```

Se connecter à l'interface mongo
```
mongo
```
Voir les database
```
show dbs
```

Utiliser la database hetic
```
use hetic
```
Voir les collections
```
show collections
```

Il y a actuellement la collection user dans la table hetic pour ajouter une autre collection (ultérieurement compétence et tags), il faut faire ceci:
```
db.createCollection('user')
```

Pour injecter des informations dans la base de donnée ATTENTION si tu colles cette ligne dans le terminal elle s'active automatiquement fait tes changements ici avant de copier coller.
```
db.user.insert({ 
    "admin" : "false",
    "password" : "root",
    "prenom" : "Julien",
    "nom" : "Marseille",
    "e-mail" : "julienmarseille38@yahoo.fr",
    "age" : 20,
    "filière" : "pmd",
    "compétences" : [ "node", "seo" ],
    "tags": ["chic type","micro-onde abuser"],
    "parcours" : "IUT MMI",
    "description" : "J’aime le travail d’équipe de découvrir de nouvelles personnalités"
}, { 
    "admin" : "false",
    "password" : "root",
    "prenom" : "Jean",
    "nom" : "Bombeur",
    "e-mail" : "julienmarseille38@yahoo.fr",
    "age" : 22,
    "filière" : "MBA",
    "compétences" : [ "node", "seo" ],
    "tags": ["boss","machine à café abuseur"],
    "parcours" : "IUT MMI",
    "description" : "J'aime leader un groupe, c'est mon truc de manager et quider les ressources pour faire grandir tout le monde !"
}, { 
    "admin" : "false",
    "password" : "root",
    "prenom" : "Anto",
    "nom" : "Swagger",
    "e-mail" : "julienmarseille38@yahoo.fr",
    "age" : 21,
    "filière" : "PMD",
    "compétences" : [ "node", "seo", "ninja", "hakido" ],
    "tags": ["Street certified","Gourou dans le rap game"],
    "parcours" : "IUT MMI",
    "description" : "J'aime leader un groupe, c'est mon truc de manager et quider les ressources pour faire grandir tout le monde !"
})
```

Pour récupérer des informations dans la collection user
```
db.user.find().pretty()
```


## Todolist

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


### 2. Connexion BDD --> Injecter dans la BDD []
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


### 3. Connexion BDD --> Supprimer du contenu []
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


### 4. Création des pages html pour dev les fonctionnalités []


### 5. Gestion d'erreur []
--> Le but est à chq erreur de renvoyer vers la 404
--> Ajouter un msg différent à chq gestion d'érreur (par ex : la personne que vous cherchez n'existe pas ou autre)

Vlà le code :
```
router.get('CHEMIN À PRÉCISER', (req, res) => { 
    res.render('404', {data : 'MSG À MODIFIER'});
});
```


### 6. Mise en place des connexion et dialogue avec la BDD []


### 7. Gestion du quiz et de la récupération des données []
    --> [] Intégrer le front 
    --> [] Gérer l'affichage des questions 1/1 dans l'interface avec un bouton suivant (FRONT JS)
    --> [] Gérer l'envoi des données (2 validation : 1. les infos importantes, 2. le quiz)
    --> [] Gérer les erreurs
        1. [] L'utilisateur à pas terminé son quiz et à quitté
            --> Il se reco et recommence directement le quizz

### 8. Quelqu'un qui recherche trop de compétence aura un msg d'erreur "Vous recherchez un dieu, nous ne trouvons personne qui corresponde à votre requête", sinon "Nous ne trouvons personne qui corresponde à votre recherche" []




## BDD --> Table QUESTIONS
```
db.questions.insert({ 
    "inscription" : [
        
    ],
    "quiz" : [
        
    ]
})
```