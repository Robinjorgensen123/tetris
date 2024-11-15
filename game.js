document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const StartBtn = document.querySelector('#StartBtn')
    const width = 10
    let nextRandom = 0
    let timerId
    let score = 0
    let level = 1
    let intervalSpeed = 1000;

    timerId = setInterval(moveDown, intervalSpeed);

    const colors = [
        'orange',
        'red',
        'purple',
        'green',
        'blue'
    ];

    const lTetromino = [
        [1, width + 1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ];
    const zTetromino = [
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1],
        [0, width, width+1, width*2+1],
        [width+1, width+2, width*2, width*2+1]
    ];

    const tTetromino = [
        [1, width, width+1, width+2],
        [1, width+1, width+2, width*2+1],
        [width, width+1, width+2, width*2+1],
        [1, width, width+1, width*2+1]
    ];

    const oTetromino = [
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1]
    ];
    const iTetromino = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3]
    ];

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

    let currentPosition = 4;
    let currentRotation = 0;
    let random = Math.floor(Math.random() * theTetrominoes.length);
    let current = theTetrominoes[random][currentRotation];

    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino');
            squares[currentPosition + index].style.backgroundColor = colors[random];
        });
    }

    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino');
            squares[currentPosition + index].style.backgroundColor = '';
        });
    }

    function control(e) {
        if (e.keyCode === 37) {
            moveLeft();
        } else if (e.keyCode === 38) {
            rotate();
        } else if (e.keyCode === 39) {
            moveRight();
        } else if (e.keyCode === 40) {
            moveDown();
        }
    }

    document.addEventListener('keyup', control);

    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();
        adjustSpeed();
    }

    function adjustSpeed() {
        if (score >= level * 20) {
            level++;
            intervalSpeed = Math.max(200, intervalSpeed - 100);
            clearInterval(timerId);
            timerId = setInterval(moveDown, intervalSpeed);
        }
    }

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

    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
        if (!isAtLeftEdge) currentPosition -= 1;
        if (current.some(index => squares[currentPosition + index].classList.contains('taken')))
            currentPosition += 1;
        draw();
    }

    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1);
        if (!isAtRightEdge) currentPosition += 1;
        if (current.some(index => squares[currentPosition + index].classList.contains('taken')))
            currentPosition -= 1;
        draw();
    }

    function rotate() {
        undraw();
        currentRotation++;
        if (currentRotation === current.length) {
            currentRotation = 0;
        }
        current = theTetrominoes[random][currentRotation];
        let isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
        let isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
        if (isAtLeftEdge) {
            currentPosition += 1;
         if (isAtRightEdge)   
            currentPosition-= 1;
        }
        if (current.some(index => squares[currentPosition + index].classList.contains('taken')))
            currentPosition -= 1;
        draw();
    }

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

    StartBtn.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        } else {
            draw();
            timerId = setInterval(moveDown, 1000);
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            displayShape();
        }
    });

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

    function gameOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            document.querySelector('#game-over-message').style.display = 'block';
            clearInterval(timerId);
        }

        document.querySelector('#restartBtn').addEventListener('click', restartGame);
    }

    function restartGame() {
        // Återställ spelets variabler
        score = 0;
        level = 1;
        intervalSpeed = 1000;
        scoreDisplay.innerHTML = score;
    
        // Dölj 'game-over' meddelandet
        document.querySelector('#game-over-message').style.display = 'none';
    
        // Ta bort alla 'taken' och 'tetromino' klasser från rutorna
        squares.forEach(square => {
            square.classList.remove('taken', 'tetromino');
            square.style.backgroundColor = ''; // Rensa bakgrundsfärgen
        });

        for (let i = 0; i < width; i++) {
            squares[squares.length - width + i].classList.add('taken');
        }
    
        // Återställ tetromino variabler
        random = Math.floor(Math.random() * theTetrominoes.length); // Ny tetromino
        current = theTetrominoes[random][currentRotation];
        currentPosition = 4;  // Startposition för tetromino
        currentRotation = 0;  // Startrotation
    
        // Rita om spelet och nästa block
        draw();
        displayShape();
    
        // Starta om spelet med den ursprungliga interval-hastigheten
        clearInterval(timerId); // Stoppa nuvarande timer om det finns en
        timerId = setInterval(moveDown, intervalSpeed);
    
    
    }
})