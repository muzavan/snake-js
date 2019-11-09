// Constant for game configuration
const CANVAS_BLOCK_WIDTH = 20;
const CANVAS_BLOCK_HEIGHT = 20;
const BLOCK_SIZE = 20;
const BLOCK_MARGIN_PRECISION = 2;
const CANVAS_WIDTH = CANVAS_BLOCK_WIDTH * BLOCK_SIZE;
const CANVAS_HEIGHT = CANVAS_BLOCK_HEIGHT * BLOCK_SIZE;
const DEFAULT_FPS = 10;
const [UP, RIGHT, DOWN, LEFT] = [0, 1, 2, 3];
const [WHITE, BLACK, RED, GREEN] = ["#FFFFFF", "#000000", "#FF0000", "#00FF00"]

// HTML Element
var btn = document.getElementById("playButton");
var fps = document.getElementById("fps");
var score = document.getElementById("score");

// Global State
// TODO: Assign this to a state object
var snakeX, snakeY, movement, tails, stop, dead;
var foodX, foodY;
var ctrl, interval;

// Global Function
var randomizeFood, initState, draw;

// Init HTML Element
btn.onclick = function(e){
    fps.disabled = true;
    var fpsValue = fps.value;
    if(fpsValue <= 0){
        fps.value = DEFAULT_FPS;
        fpsValue = DEFAULT_FPS;
    }

    if (interval){
        clearInterval(interval);
    }

    initState();
    interval = setInterval(draw, 1000/fpsValue);
}

var canvas = document.getElementById("canvas");
canvas.setAttribute("width", "" + CANVAS_WIDTH);
canvas.setAttribute("height", "" + CANVAS_HEIGHT);
var ctx = canvas.getContext("2d");

randomizeFood = function (){
    // Randomize food to new position
    var valid = false;

    while(!valid){
        foodX = Math.floor(Math.random() * CANVAS_BLOCK_WIDTH) * BLOCK_SIZE;
        foodY = Math.floor(Math.random() * CANVAS_BLOCK_HEIGHT) * BLOCK_SIZE;

        // Avoid put food in the tails or snake position
        valid = !tails.some(function(v, _, _){
            return v[0] == foodX && v[1] == foodY;
        }) && !(snakeX == foodX && snakeY == foodY)
    }
    
}

initState = function(){
    // Init Snake 
    // Snake defined as => snake + [...tails]
    snakeX = ((CANVAS_BLOCK_WIDTH / 2) - 1) * BLOCK_SIZE;
    snakeY = ((CANVAS_BLOCK_HEIGHT / 2) - 1) * BLOCK_SIZE;
    movement = 0; // 0: UP, 1: RIGHT, 2: DOWN, 3: LEFT
    tails = []; // Array of [x, y]
    stop = false;
    dead = false;

    // Init Food
    randomizeFood();
}

// Main Control Logic
ctrl = {
    up: function(){
        if(movement != DOWN){
            movement = UP;
        }
    },
    down: function(){
        if(movement != UP){
            movement = DOWN;
        }
    },
    left: function(){
        if(movement != RIGHT){
            movement = LEFT;
        }
    },
    right: function(){
        if(movement != LEFT){
            movement = RIGHT;
        }
    },
    p: function(){
        stop = !stop;
    }
}

initControl(ctrl);

// Main Game Logic
function isEaten (){
    // Check if rectangle is overlapping
    if (snakeX > (foodX + BLOCK_SIZE - BLOCK_MARGIN_PRECISION) || foodX > (snakeX + BLOCK_SIZE - BLOCK_MARGIN_PRECISION)){
        return false;
    }

    if (snakeY > (foodY + BLOCK_SIZE - BLOCK_MARGIN_PRECISION) || foodY > (snakeY + BLOCK_SIZE - BLOCK_MARGIN_PRECISION)){
        return false;
    }

    return true;
}

function isDead(){
    if (snakeX < 0 || snakeX >= CANVAS_WIDTH){
        return true;
    }
    if (snakeY < 0 || snakeY >= CANVAS_HEIGHT){
        return true;
    }
    return tails.some(function(v, _, _){
        return snakeX == v[0] && snakeY == v[1];
    });
}

function invalidateGameLogic(){
    // Check if the food is eaten
    if(isDead()){
        dead = true;
    }
    if(isEaten()){
        // Add tails
        tails.reverse();
        tails.push([snakeX, snakeY]);
        tails.reverse();
        randomizeFood();
    }

    if(!stop){
        if (tails.length > 0){
            tails.pop();
            tails.reverse();
            tails.push([snakeX, snakeY]);
            tails.reverse();
        }
        switch(movement){
            case UP:
                snakeY-=BLOCK_SIZE;
                break;
            case DOWN:
                snakeY+=BLOCK_SIZE;
                break;
            case LEFT:
                snakeX-=BLOCK_SIZE;
                break;
            case RIGHT:
                snakeX+=BLOCK_SIZE;
                break;
        }
    }
}

// Main Draw Logic
function drawBoard(){
    ctx.fillStyle = BLACK;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function drawFood(){
    ctx.fillStyle = RED;
    ctx.fillRect(foodX, foodY, BLOCK_SIZE, BLOCK_SIZE);
}

function drawSnake(){
    ctx.fillStyle = WHITE;
    if(stop){
        ctx.fillStyle = GREEN;
    }
    ctx.fillRect(snakeX, snakeY, BLOCK_SIZE, BLOCK_SIZE);

    tails.forEach(function(v, i, arr){
        ctx.fillRect(v[0], v[1], BLOCK_SIZE, BLOCK_SIZE);
    });
}

function drawScore(){
    score.innerText = "Score: "+ (tails.length)
}

draw = function(){
    invalidateGameLogic();
    drawBoard();
    if(!dead){  
        drawSnake();
        drawFood();
    }
    else{
        fps.disabled = false;
    }
    drawScore();
}
