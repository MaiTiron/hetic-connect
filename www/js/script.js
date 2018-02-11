var container;

// Attendre le chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  container = document.querySelector('#container');
  
  
});		

var element = document.getElementById('yo');
console.log( $('#yo'));

var users = {};
$.ajax({
  type: 'POST',
  data: JSON.stringify(users),
  contentType: 'application/json',
  url: 'http://localhost:3000/api/data',					
  success: function(users) {
    //element.addEventListener("input", function(e) {
      $('#yo').on('input', function(){
        $('#container>*').remove();
        console.log(users);
        search(this.value.toLowerCase(), users.data);
        
      });
    }
});

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
  
    if (countMatched>0) affichage(user.username, user.description, user.competences, countPeople);
  }
}


function injectCompetences(competences, i) {
  for (competence of competences ) {
    console.log(competence);

    $('.list-competences-'+i).prepend("<a href='#'>" + competence + "</a></br>");
  }
};

function affichage(username, bio, competences, i) {
  console.log('test');
  console.log('username : ' + username );
  console.log('bio : ' + bio);
  console.log('compétences : ' + competences);
  
  // Gestion de du nb de compétences
  var content = "<article><h3>" + username +  "</h3><p>" + bio + "</p><div class='list-competences-" + i + "' ></div></article>";


  $('#container').append(content);
  injectCompetences(competences, i);
  
  var content = "";
}
