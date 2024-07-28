const musicBg = new Audio('musicBg.mp3');

let container = document.getElementById('container');

let slow = document.getElementById('slow');
let medium = document.getElementById('medium');
let fast = document.getElementById('fast');

let score = document.getElementById('score');
let highScore = document.getElementById('highScore');
let board = document.getElementById('board');

let snakeDir = {x:1,y:0};
let snakeArr = [{x:Math.round((Math.random()*18)+2),y:Math.round((Math.random()*18)+2)}];
let food = {x:Math.round((Math.random()*18)+2),y:Math.round((Math.random()*18)+2)};

let lastPaintTime = 0;

let snakeScore = 0;
let snakeHighScore = 0;

// increse the speed of snake game
let speed = JSON.parse(localStorage.getItem('speed')) ?? 5;

slow.addEventListener('click',()=>{
    speed = 2;
    localStorage.setItem('speed',JSON.stringify(speed));
});

medium.addEventListener('click',()=>{
    speed = 5;
    localStorage.setItem('speed',JSON.stringify(speed));
});

fast.addEventListener('click',()=>{
    speed = 8;
    localStorage.setItem('speed',JSON.stringify(speed));
});

// checking the condition whether snake has collided with wall or itself
let iscollide = (snakeBody)=>{
    for(let i = 1; i<snakeBody.length ;i++){
        if(snakeBody[i].x === snakeBody[0].x && snakeBody[i].y === snakeBody[0].y){
            return true;
        }
    }
    if(snakeBody[0].x >= 20 || snakeBody[0].x <= 0 || snakeBody[0].y >= 20 || snakeBody[0].y <= 0){
        return true
    }
}

// getting Stars based on snakeHighScore
let getStars = (snakeHighScore)=>{
    if(snakeHighScore >= 250){
        stars[0].children[0].classList.add('fa-solid');
        stars[0].children[0].classList.remove('fa-regular');
        stars[1].children[0].classList.add('fa-solid');
        stars[1].children[0].classList.remove('fa-regular');
        stars[2].children[0].classList.add('fa-solid');
        stars[2].children[0].classList.remove('fa-regular');
        stars[3].children[0].classList.add('fa-solid');
        stars[3].children[0].classList.remove('fa-regular');
        stars[4].children[0].classList.add('fa-solid');
        stars[4].children[0].classList.remove('fa-regular');
    }
    else if(snakeHighScore >= 200){
        stars[0].children[0].classList.add('fa-solid');
        stars[0].children[0].classList.remove('fa-regular');
        stars[1].children[0].classList.add('fa-solid');
        stars[1].children[0].classList.remove('fa-regular');
        stars[2].children[0].classList.add('fa-solid');
        stars[2].children[0].classList.remove('fa-regular');
        stars[3].children[0].classList.add('fa-solid');
        stars[3].children[0].classList.remove('fa-regular');
    }
    else if(snakeHighScore >= 150){
        stars[0].children[0].classList.add('fa-solid');
        stars[0].children[0].classList.remove('fa-regular');
        stars[1].children[0].classList.add('fa-solid');
        stars[1].children[0].classList.remove('fa-regular');
        stars[2].children[0].classList.add('fa-solid');
        stars[2].children[0].classList.remove('fa-regular');
    }
    else if(snakeHighScore >= 100){
        stars[0].children[0].classList.add('fa-solid');
        stars[0].children[0].classList.remove('fa-regular');
        stars[1].children[0].classList.add('fa-solid');
        stars[1].children[0].classList.remove('fa-regular');
    }
    else if(snakeHighScore >= 50){
        stars[0].children[0].classList.add('fa-solid');
        stars[0].children[0].classList.remove('fa-regular');
    }
}


// repeating the main function again and again
let main = (currTime)=>{
    window.requestAnimationFrame(main);
    if(((currTime - lastPaintTime)/1000) < (1/speed)) return;
    lastPaintTime = currTime;
    snakeGame();
}

// creating starting of snake game 
let snakeGame = ()=>{
    musicBg.play();
    // checking the condition whether snake has collided with wall or itself
    if(iscollide(snakeArr)){
        musicBg.pause();
        snakeArr = [{x:Math.round((Math.random()*18)+2),y:Math.round((Math.random()*18)+2)}];
        let gameOver = document.createElement('div');
        gameOver.setAttribute('id','gameOver');
        gameOver.innerHTML = `Game Over!! <span id="remove">&times;</span><button id="playAgain">Play Again</button>`;
        container.appendChild(gameOver);
        snakeDir = {x:0,y:0};
        let remove = document.getElementById('remove');
        let playAgain = document.getElementById('playAgain');

        remove.addEventListener('click',(e)=>{
            let alert = e.target.parentElement;
            window.location.href = 'index.html';
            alert.remove();
        });

        playAgain.addEventListener('click',(e)=>{
            let alert = e.target.parentElement;
            location.replace('index.html');
            alert.remove();
        });
    }
    
    // creating if snake has been eaten the food
    if(snakeArr[0].x === food.x && snakeArr[0].y === food.y){
        snakeScore += 1;
        if(snakeScore > snakeHighScore){
            snakeHighScore = snakeScore;
            getStars(snakeHighScore);
            localStorage.setItem('snakeHighScore',JSON.stringify(snakeHighScore));
            highScore.innerHTML = `High Score : <span id="highScoreValue">${snakeHighScore}</span>`;
        }
        score.innerHTML = `Score : <span id="scoreValue">${snakeScore}</span>`;
        snakeArr.unshift({x:snakeArr[0].x + snakeDir.x , y:snakeArr[0].y + snakeDir.y});
        let a = 2;
        let b = 18;
        food = {x:Math.floor(a + (b-a) * Math.random()), y:Math.floor(a + (b-a) * Math.random())};
    }
    
    // creating the moving snake with snake body
    for(let i = snakeArr.length-2; i>=0; i--){
        snakeArr[i+1] = {...snakeArr[i]};
    }

    // creating a moving of snake only without snake body
    snakeArr[0].x += snakeDir.x; 
    snakeArr[0].y += snakeDir.y; 
    
    // the board on which snake moves
    board.innerHTML = '';

    // creating snake's head and body
    snakeArr.forEach((snakeValue,index)=>{
        let snakeHead = document.createElement('div');
        snakeHead.style.gridRowStart = snakeValue.y;
        snakeHead.style.gridColumnStart = snakeValue.x;
        if(index === 0){
            snakeHead.classList.add('head');
        }
        else{
            snakeHead.classList.add('snake-body');
        }
        board.appendChild(snakeHead);
    });

    // creating snake's food
    let snakeFood = document.createElement('div');
    snakeFood.style.gridRowStart = food.y;
    snakeFood.style.gridColumnStart = food.x;
    snakeFood.classList.add('food');
    board.appendChild(snakeFood);
}

// creating a direction for snake to move in which direction
let onKeyDown = (e)=>{
    switch(e.key){
        case 'ArrowRight':
            if(e.key === 'ArrowRight' && snakeDir.x === 0){
                snakeDir.x = 1;
                snakeDir.y = 0;
            }
            break;
        case 'ArrowLeft':
            if(e.key === 'ArrowLeft' && snakeDir.x === 0){
                snakeDir.x = -1;
                snakeDir.y = 0;
            }
            break;
        case 'ArrowUp':
            if(e.key === 'ArrowUp' && snakeDir.y === 0){
                snakeDir.x = 0;
                snakeDir.y = -1;
            }
            break;
        case 'ArrowDown':
            if(e.key === 'ArrowDown' && snakeDir.y === 0){
                snakeDir.x = 0;
                snakeDir.y = 1;
            }
            break;
        default:
            break;
    }
}

window.addEventListener('keydown',onKeyDown);

let stars = document.querySelectorAll('.star');

snakeHighScore = localStorage.getItem('snakeHighScore');
if(snakeHighScore === null){
    snakeHighScore = 0;
    localStorage.setItem('snakeHighScore',JSON.stringify(snakeHighScore));
}
else{
    highScore.innerHTML = `High Score : <span id="highScoreValue">${JSON.parse(snakeHighScore)}</span>`;
    getStars(snakeHighScore);
}

window.requestAnimationFrame(main);