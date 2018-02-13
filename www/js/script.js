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
      console.log(users);
      $('#rechercher').on('input', function(){
        $('#container>*').remove();
        console.log("succes : " + users);
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
      // Vérifie qu'on à bien le contenu de l'input dans les compétences
    for (competence of user.competences) {
      
      if (competence.toLowerCase().indexOf(inputValue) == 0){
        
        countMatched++;
      }
    
    }
  
    if (countMatched>0) affichage( user.username, user.description, user.competences,user._id, user.profil, countPeople);
  }
}


function injectCompetences(competences, i) {
  for (competence of competences ) {
    console.log(competence);
    console.log($('.list-competences-'+i));
    $('.list-competences-'+i).prepend("<a href='#'>" + competence + "</a>");
  }
};

function affichage(username, description, competences,id,profil, i) {
  console.log('test');
  console.log('username : ' + username );
  console.log('description : ' + description);
  console.log('compétences : ' + competences);
  console.log(id);
  
  // Gestion de du nb de compétences
  var content = "<section class='contenu'><a href='/voir-profil/" + id + "'><img src='../img/axelle.png' alt=''/><img class='echarpe' alt='écharpe hétic' src='../img/echarpe.png'/><div class='rectangle'><article><p>" + username + "<br/>" + profil + "</p><p>"+ description + "</p></article><article><div class='list-competences-" + i + "' ></div></article></div></a></section>";
  $('#container').append(content);
  injectCompetences(competences, i);
  
  var content = "";
}