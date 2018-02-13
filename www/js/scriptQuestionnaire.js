var questionContainer;
var nextScreen;
var lastScreen;


// Attendre le chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    var i = 0;

    questionContainer = document.querySelectorAll('.question');
    nextBtn = document.querySelector('.nextScreen');
    lastBtn = document.querySelector('.lastScreen');

    nextBtn.addEventListener('click', function () {
        nextScreen(i);
        i++;
    });
    lastBtn.addEventListener('click', function () {
        previousScreen(i);
        i--;
    });
});		

function previousScreen(index) {
    if (index > 0 && index <= questionContainer.length-1) {
        questionContainer[index].style.display = 'none';
        questionContainer[index-1].style.display = 'block';
        nextBtn.style.display = 'block';
        
        if (index <= 1) {
            lastBtn.style.display = 'none';
            console.log('quoi ?');
        }
    }
}

function nextScreen(index) {
    if (index >= 0 && index < questionContainer.length-1) {
        console.log('-->' + index + ' ' + questionContainer.length);
        questionContainer[index].style.display = 'none';
        questionContainer[index+1].style.display = 'block';
        lastBtn.style.display = 'block';

        if (index >= questionContainer.length-2) {
            nextBtn.style.display = 'none';
            console.log('quoi ?');
        }
    } 
}