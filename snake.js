'use strict'

const cnv = document.getElementById('canvas');
const ctx = cnv.getContext('2d');

let startBtn = document.querySelector('.start');
let exitBtn = document.querySelector('.exit');

let opts = {
	cellSize: 30
}


let adaptiveW = Math.floor(window.innerWidth/opts.cellSize);
let adaptiveH = Math.floor(window.innerHeight/opts.cellSize);

if(adaptiveW%2 != 0) {
	adaptiveW--;
}

if(adaptiveH%2 != 0) {
	adaptiveH--;
}
let cnvW = cnv.width = adaptiveW*opts.cellSize;
let cnvH = cnv.height = adaptiveH*opts.cellSize;

let foodImg = new Image();
foodImg.src = 'fairy.png';

let snakeImg = new Image();
snakeImg.src = 'snail.png';

let score = 0;
// ctx.font = '20px Arial';
// ctx.fillStyle = 'red';

class Snake {

	cellSize = opts.cellSize;
	speed = 100;
	size = 3;
	x = cnvW/2-this.cellSize*(this.size-1);
	y = cnvH/2;	
	snakeDir = 'right';

	arr = [{x: this.x, y: this.y}];
	head = {x: cnvW/2, y: cnvH/2}

	_create() {
		for(let i = 1; i < this.size; i++) {
			this.arr.push({x: this.x + this.cellSize*i, y: this.y})
		}
	}


	move() {
		
		if(this.snakeDir == 'right') {
			this.head.x += this.cellSize;
		}

		if(this.snakeDir == 'left') {
			this.head.x -= this.cellSize;
		}

		if(this.snakeDir == 'top') {
			this.head.y -= this.cellSize;
		}

		if(this.snakeDir == 'bottom') {
			this.head.y += this.cellSize;
		}


		let newHead = {x: this.head.x, y: this.head.y};
		this.arr.push(newHead);
		if(newHead.x != food.x || newHead.y != food.y) {
			this.arr.splice(0, 1);
		}
		// console.log(this.arr);
	}

	eat() {
		for(let item of this.arr) {
			if(food.x == item.x && food.y == item.y) {
				food.x = random(0, (cnvW - snake.cellSize));
				food.y = random(0, (cnvH - snake.cellSize));
				score += 1;
			}
		}
	}

	die() {
		let snakeHeadX = this.arr[this.arr.length-1].x;
		let snakeHeadY = this.arr[this.arr.length-1].y;
		if(snakeHeadX < 0 || snakeHeadX > cnvW-this.cellSize || snakeHeadY < 0 || snakeHeadY > cnvH-this.cellSize) {
			showMessageRestart('You Lose!');
		}


		for(let item of this.arr.slice(0, this.arr.length-1)) {
			if(snakeHeadX == item.x && snakeHeadY == item.y) {
				showMessageRestart('You Lose!');
			}
		}
	}

	draw() {
		for(let i = 0; i < this.arr.length; i++) {
			ctx.drawImage(snakeImg, this.arr[i].x, this.arr[i].y, snake.cellSize-1, 
				snake.cellSize-1);
		}

	}
}

let snake = new Snake();
let now = Date.now();


class Food {
	x = random(0, (cnvW - snake.cellSize));
	y = random(0, (cnvH - snake.cellSize));


	draw() {
		ctx.drawImage(foodImg, this.x, this.y, snake.cellSize, 
			snake.cellSize);
	}
}

let food = new Food();


class Game {
	start() {
		snake._create();
		update();
	}
}

let game = new Game();
// game.start();

startBtn.onmousedown = function() {
	startBtn.style.margin = '-2px';
}
startBtn.onmouseup = function() {
	startBtn.style.margin = '0';
	startBtn.parentNode.removeChild(startBtn);
	exitBtn.parentNode.removeChild(exitBtn);
	game.start();
}

exitBtn.onmousedown = function() {
	exitBtn.style.marginTop = '48px';
	exitBtn.style.marginLeft = '-2px';
}
exitBtn.onmouseup = function() {
	exitBtn.style.marginTop = '50px';
	exitBtn.style.marginLeft = '0';

	window.close();
}




function update() {
	requestAnimationFrame(update);
	defineDirection();

	if(Date.now() - now > snake.speed) {
		ctx.clearRect(0,0,cnvW,cnvH);
		snake.move();
		snake.die();
		snake.draw();
		snake.eat();
		food.draw();
		write(`Score: ${score}`, 5, 20, 15, 'red', 'Arial');
		now = Date.now();
	}
}


function defineDirection() {
	

	window.onkeydown = function(e) {

		if(e.keyCode === 87 && snake.snakeDir !== 'bottom') snake.snakeDir = 'top';
		if(e.keyCode === 83 && snake.snakeDir !== 'top') snake.snakeDir = 'bottom';

		if(e.keyCode === 65 && snake.snakeDir !== 'right') snake.snakeDir = 'left';
		if(e.keyCode === 68 && snake.snakeDir !== 'left') snake.snakeDir = 'right';
	}
}

function random(rows, cols) {
	let rand = Math.floor(rows + Math.random()*(cols - rows + 1));
	while(rand % snake.cellSize != 0) {
		rand = Math.floor(rows + Math.random()*(cols - rows + 1));
	}
	return rand;
}

function showMessageRestart(msg) {
	alert(msg);
	location.reload();
}

function write(txt, x, y, fz, color, fFamily) {
	ctx.font = `${fz}px ${fFamily}`;
	ctx.fillStyle = color;
	ctx.fillText(txt, x, y);
}