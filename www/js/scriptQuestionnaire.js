var questionContainer;
var nextScreen;
var lastScreen;



// Attendre le chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    var i = 0;

    questionContainer = document.querySelectorAll('.question');
    console.log(questionContainer.length);
    nextBtn = document.querySelector('.nextScreen');
    lastBtn = document.querySelector('.lastScreen');


    nextBtn.addEventListener('click', function () {
        console.log(i);
        nextScreen(i);
        i++;
    });
    lastBtn.addEventListener('click', function () {
        console.log(i);
        previousScreen(i);
        i--;
    });
});		

function previousScreen(index) {
    if (index > 0 && index <= questionContainer.length) {
        console.log('<--' +  index + ' ' + questionContainer.length);
        questionContainer[index].style.display = 'none';
        questionContainer[index-1].style.display = 'block';
        
        nextBtn.style.display = 'block';
    } else {
        last.style.display = 'none';
    }
}

function nextScreen(index) {
    if (index >= 0 && index < questionContainer.length) {
        console.log('-->' + index + ' ' + questionContainer.length);
        questionContainer[index].style.display = 'none';
        questionContainer[index+1].style.display = 'block';
        
        lastBtn.style.display = 'block';
    } else {
        nextBtn.style.display = 'none';
    }
}