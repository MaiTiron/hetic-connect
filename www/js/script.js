

// Attendre le chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  //document.querySelector('button').submit( (e) => e.preventDefault() );
  
  
});		

var element = document.getElementById('yo');

var user = {};
$.ajax({
  type: 'POST',
  data: JSON.stringify(user),
  contentType: 'application/json',
  url: 'http://localhost:3000/api/data',					
  success: function(user) {
    //element.addEventListener("input", function(e) {
      $('#yo').on('input', function(){
        console.log(user.data);
        $('#container>*').remove();
        search(this.value.toLowerCase(), user.data);
        
      });
    }
});

var countPeople = 0;
function search(inputValue, userList){
  
  for (user of userList){
    
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
  
    if (countMatched>0) affichage(user.prenom, user.nom, user.description, user.competences, countPeople);
  }
}


function injectCompetences(competences, i) {
  for (competence of competences ) {
    console.log(competence);

    $('.list-competences-'+i).prepend("<a href='#'>" + competence + "</a></br>");
  }
};

function affichage(prenom, nom, bio, competences, i) {
  console.log('test');
  console.log('nom : ' + prenom + ' ' + nom);
  console.log('bio : ' + bio);
  console.log('compétences : ' + competences);
  
  // Gestion de du nb de compétences
  var content = "<article><h3>" + prenom + " " + nom + "</h3><p>" + bio + "</p><div class='list-competences-" + i + "' ></div></article>";
  console.log(competences);
  $('#container').append(content);
  var content = "";
  injectCompetences(competences, i);

}
