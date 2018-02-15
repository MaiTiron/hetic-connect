var container;

// Attendre le chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  container = document.querySelector('#container');
  launchRequest();
});        



var users = {};
function launchRequest() {
  $.ajax({
    type: 'POST',
    data: JSON.stringify(users),
    contentType: 'application/json',
    url: 'http://localhost:3000/data',
    success: function(users) {
      console.log(users.data);
      $('#recherche').on('input', function(){
        $('#container>*').remove();
        search(this.value.toLowerCase(), users.data);
      });
    }
  });  
}

var countPeople = 0;
function search(inputValue, userList){
  
  for (user of userList){
    user.username = user.nom +' '+ user.prenom;
    
    countPeople++;
    var countMatched = 0;
      //verifie que le nom et prenom contient le texte
    if (user.prenom.toLowerCase().indexOf(inputValue) == 0 || user.nom.toLowerCase().indexOf(inputValue) == 0 ){
      countMatched++;
    }
    
      // Vérifie dans les compétences dev
    for (domaine of user.dev) {  
      if (domaine.toLowerCase().indexOf(inputValue) == 0){
        countMatched++;
      }
    }

      // Vérifie dans les compétences communication et marketing
    for (domaine of user.com) {   // On parcours les domaines de compétences
      if (domaine.toLowerCase().indexOf(inputValue) == 0){
        countMatched++;
      }
    }

      // Vérifie dans les compétences design   
    for (domaine of user.design) {   // On parcours les domaines de compétences
      if (domaine.toLowerCase().indexOf(inputValue) == 0){
        countMatched++;
      }
    }
    
    if (countMatched>0) affichage( user.username, user.description, user.profil, user.design, user.com, user.dev, user._id, user.imgURL, countPeople, inputValue);
  }
}


function injectDev(competences, i) {
  for (competence of competences ) {
    $('.list-dev-'+i).prepend("<a href='#'>" + competence + "</a></br>");
  }
};
function injectCom(competences, i) {
  for (competence of competences ) {
    $('.list-com-'+i).prepend("<a href='#'>" + competence + "</a></br>");
  }
};
function injectDesign(competences, i) {
  for (competence of competences ) {
    $('.list-design-'+i).prepend("<a href='#'>" + competence + "</a></br>");
  }
};

function affichage(username, description, profil, design, com, dev ,id, img, i, inputValue) {
  
  // Gestion de du nb de compétences
  
  var content = "<section class='contenu'><a href='/voir-profil/" + id + "'><img src='../uploads/"+ img +"' alt='image de profile' /><img class='echarpe' alt='écharpe hétic' src='../img/echarpe.png'/><div class='rectangle'><article><p>" + username +  "<br/>" + profil + "</p><p>" + description + "</p></article><article><div id='dev' class='list-dev-" + i + "' ></div><div id='com' class='list-com-" + i + "' ></div><div id='design' class='list-design-" + i + "' ></div></article></div></a></section>";
  if (inputValue === ""){
    var content = "";
  }
  $('#container').append(content);
  injectDev(dev, i);
  injectDesign(design, i);
  injectCom(com, i);
  
  var content = "";
}


// Activer champs suppression profil
function suppr(){
  var form = document.querySelector("#suppr");
  form.style.display = "block";
}