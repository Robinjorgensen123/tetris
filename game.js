    document.addEventListener('DOMContentLoaded', () => {
        const grid = document.querySelector('.grid')
        let squares = Array.from(document.querySelectorAll('.grid div'))
        const scoreDisplay = document.querySelector('#score')
        const StartBtn = document.querySelector('#StartBtn')
        const width = 10
        let nextRandom = 0
        let timerId
        let score = 0
        
        



    const lTetromino = [
        [1, width + 1, width*2+1, 2], 
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ]
    const zTetromino = [
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1,width+2,width*2,width*2+1]
    ]

    const tTetromino = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]  

        ]
    
    const oTetromino = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
    ]
    const iTetromino = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
    ]

    





const theTetrominoes = [lTetromino,zTetromino,tTetromino,oTetromino,iTetromino]

let currentPosition = 4
let currentRotation = 0
let random = Math.floor(Math.random()*theTetrominoes.length)
let current = theTetrominoes [random] [currentRotation]

console.log(random)

function draw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.add('tetromino')
    });
}

function undraw () {
    current.forEach(index => {
        squares[currentPosition + index].classList.remove('tetromino')
    })
}

timerId = setInterval(moveDown, 1000) 

function control(e) {
    if(e.keyCode === 37) {
        moveLeft()
    } else if (e.keyCode === 38) {
        rotate()
    } else if (e.keyCode === 39) {
        moveRight()
    } else if (e.keyCode === 40) {
        moveDown()
    }
}
document.addEventListener('keyup',control)
   

function moveDown() {
    undraw()
    currentPosition += width
    draw()
    freeze()
}


function freeze() {
 if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
    current.forEach(index => squares[currentPosition + index].classList.add('taken'))
    random = nextRandom
    nextRandom = Math.floor(Math.random() * theTetrominoes.length)
    current = theTetrominoes[random] [currentRotation]
    currentPosition = 4
    draw()
    displayShape()
    addScore()
 }
}
function moveLeft() {
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

    if (!isAtLeftEdge) currentPosition -=1

    if (current.some(index => squares[currentPosition + index].classList.contains('taken')))
        currentPosition +=1
    
    }
    draw()




function moveRight() {
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)

    if (!isAtRightEdge) currentPosition += 1;

    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) 
        currentPosition -= 1;
    }
    draw();
    

    function rotate() {
        undraw()
        currentRotation++
        if (currentRotation === current.length) { 
            currentRotation = 0
    }
        current = theTetrominoes[random][currentRotation]
        draw()
    }

    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    let displayIndex = 0
    

    const upNextTetrominoes = [
        [1, displayWidth+1, displayWidth*2+1, 2],
        [0, displayWidth, displayWidth+1, displayWidth*2+1],
        [1, displayWidth, displayWidth+1, displayWidth*2+1],
        [0, 1, displayWidth, displayWidth+1],
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1]
    ]

    function displayShape() {
        displaySquares.forEach(squares => {
            squares.classList.remove('tetromino')
        })
        upNextTetrominoes[nextRandom].forEach( index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
        })
    }

    StartBtn.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId)
            timerId = null

        } else {
            draw()
            timerId = setInterval(moveDown, 1000)
            nextRandom = Math.floor(Math.random()*theTetrominoes.length)
            displayShape()    
            }
        }
    )
    function addScore() {
        for (let i = 0; i < 199; i += width) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];
            
    
            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += 10;  // Lägg till poäng
                scoreDisplay.innerHTML = score;
    
                // Ta bort 'taken' klassen från divarna i den fulla raden
                row.forEach(index => squares[index].classList.remove('taken'));
    
                // Ta bort hela raden från grid
                squares.splice(i, width);
    
                // Skapa en array av nya tomma divs (utan 'taken' klass)
                const emptySquares = Array(width).fill(null).map(() => {
                    const div = document.createElement('div');
                    div.classList.remove('taken'); // Se till att 'taken' inte finns
                    return div;
                });
    
                // Lägg till de nya tomma divs i början av arrayen
                squares = emptySquares.concat(squares);
    
                // Uppdatera divarna i DOM
                squares.forEach((div, index) => {
                    div.style.top = `${Math.floor(index / width) * 30}px`; // Placera divarna vertikalt
                    div.style.left = `${(index % width) * 30}px`;         // Placera divarna horisontellt
                    grid.appendChild(div);  // Lägg till divarna i DOM (griden)
                });
            }
        }
    }


})
    