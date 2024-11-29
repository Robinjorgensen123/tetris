document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const scoreDisplay = document.querySelector('#score');
    const StartBtn = document.querySelector('#StartBtn');
    const highscoreElement = document.querySelector('#highscore-list');
    const width = 10;
    let nextRandom = 0;
    let timerId;
    let score = 0;
    let level = 1;
    let intervalSpeed = 1000;
    
    // Färger för varje tetromino
    const colors = ['orange', 'red', 'purple', 'green', 'blue'];

    // Display high scores from localStorage
    function displayHighscore() {
        const highscoreList = JSON.parse(localStorage.getItem('highscores')) || [];
        highscoreElement.innerHTML = '';

        if (highscoreList.length === 0) {
            const noScoresItem = document.createElement('li');
            noScoresItem.textContent = 'Inga poäng än.';
            highscoreElement.appendChild(noScoresItem);
        } else {
            highscoreList.forEach((score, index) => {
                const scoreItem = document.createElement('li');
                scoreItem.textContent = `#${index + 1} - ${score}`;
                highscoreElement.appendChild(scoreItem);
            });
        }
    }

    // Tetromino-mönster
    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ];
    const zTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ];
    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ];
    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ];
    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ];

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

    // Initialisera variabler för den aktuella figuren
    let currentPosition = 4;
    let currentRotation = 0;
    let random = Math.floor(Math.random() * theTetrominoes.length);
    let current = theTetrominoes[random][currentRotation];

    // Funktion för att rita figuren
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino');
            squares[currentPosition + index].style.backgroundColor = colors[random];
        });
    }

    // Funktion för att ta bort figuren
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino');
            squares[currentPosition + index].style.backgroundColor = '';
        });
    }

    // Funktion för att hantera tangentintryckningar
    function control(e) {
        if (e.keyCode === 37) {  // Left arrow
            moveLeft();
        } else if (e.keyCode === 38) {  // Up arrow
            rotate();
        } else if (e.keyCode === 39) {  // Right arrow
            moveRight();
        } else if (e.keyCode === 40) {  // Down arrow
            moveDown();
        }
    }
    document.addEventListener('keyup', control);

    // Funktion för att flytta figuren neråt
    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();
        adjustSpeed();
    }

    // Justera spelhastigheten baserat på poängen
    function adjustSpeed() {
        if (score >= 0 * 20) {
            level++;
            intervalSpeed = Math.max(200, intervalSpeed -100);
            clearInterval(timerId);
            timerId = setInterval(moveDown, intervalSpeed);
        }
    }

    // Funktion för att "frysa" figuren när den når botten
    function freeze() {
        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'));
            random = nextRandom;
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            current = theTetrominoes[random][currentRotation];
            currentPosition = 4;
            draw();
            displayShape();
            addScore();
            gameOver();
        }
    }

    // Funktion för att flytta figuren åt vänster
    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
        if (!isAtLeftEdge) currentPosition -= 1;
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) currentPosition += 1;
        draw();
    }

    // Funktion för att flytta figuren åt höger
    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
        if (!isAtRightEdge) currentPosition += 1;
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) currentPosition -= 1;
        draw();
    }

    function gameOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            document.querySelector('#game-over-message').style.display = 'block';
            clearInterval(timerId);
            timerId = null;
            
            // Save highscore
            if (score > 0) {
                let highscoreList = JSON.parse(localStorage.getItem('highscores')) || [];
                highscoreList.push(score);
                highscoreList.sort((a, b) => b - a);
                highscoreList = highscoreList.slice(0, 10);
                localStorage.setItem('highscores', JSON.stringify(highscoreList));
            }
            displayHighscore();

            // Restart the game on button click
            document.querySelector('#restartBtn').addEventListener('click', restartGame);
        }
    }

    // Funktion för att rotera figuren
    function rotate() {
        undraw();
        currentRotation++;
        if (currentRotation === current.length) currentRotation = 0;
        current = theTetrominoes[random][currentRotation];
        let isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
        let isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
        if (isAtLeftEdge) currentPosition += 1;
        if (isAtRightEdge) currentPosition -= 1;
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) currentPosition -= 1;
        draw();
    }

    // Funktion för att visa nästa form i mini-griden
    const displaySquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 6;
    let displayIndex = 0;
    const upNextTetrominoes = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2],
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],
        [1, displayWidth, displayWidth + 1, displayWidth * 2 + 1],
        [0, 1, displayWidth, displayWidth + 1],
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1]
    ];

    // Visa nästa form
    function displayShape() {
        displaySquares.forEach(squares => {
            squares.classList.remove('tetromino');
            squares.style.backgroundColor = '';
        });
        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino');
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
        });
    }

    // Start-knappens funktion
    StartBtn.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        } else {
            draw();
            timerId = setInterval(moveDown, intervalSpeed);
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            displayShape();
        }
    });

    // Lägg till poäng
    function addScore() {
        for (let i = 0; i < 199; i += width) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];
            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += 10;
                scoreDisplay.innerHTML = score;

                row.forEach(index => {
                    squares[index].classList.remove('taken');
                    squares[index].classList.remove('tetromino');
                    squares[index].style.backgroundColor = '';
                });

                const squaresRemoved = squares.splice(i, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell));

                adjustSpeed();
            }
        }
    }

    function restartGame() {
        score = 0;
        level = 1;
        intervalSpeed = 1000;
        scoreDisplay.innerHTML = score;
    
        document.querySelector('#game-over-message').style.display = 'none';
    
        squares.forEach(square => {
            square.classList.remove('taken', 'tetromino');
            square.style.backgroundColor = ''; 
        });
    
        for (let i = 0; i < width; i++) {
            squares[squares.length - width + i].classList.add('taken');
        }
    
        random = Math.floor(Math.random() * theTetrominoes.length); 
        current = theTetrominoes[random][currentRotation];
        currentPosition = 4;  
        currentRotation = 0;  
        draw();
        displayShape();
    
        clearInterval(timerId);
        timerId = setInterval(moveDown, intervalSpeed);
    }
});
