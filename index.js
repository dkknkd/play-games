document.addEventListener('DOMContentLoaded', () => {
    const gameSelection = document.getElementById('game-selection');
    const ticTacToeGame = document.getElementById('tic-tac-toe');
    const rockPaperScissorsGame = document.getElementById('rock-paper-scissors');
    const shootBubbleGame = document.getElementById('shoot-bubble');
    const memoryMatchGame = document.getElementById('memory-match');
    const snakeGame = document.getElementById('snake');
    const ticTacToeBoard = document.getElementById('tic-tac-toe-board');
    const rpsResult = document.getElementById('rps-result');
    const difficultySelectRPS = document.getElementById('difficulty-rps');
    const difficultySelectMM = document.getElementById('difficulty-mm');
    const scoreX = document.getElementById('score-x');
    const scoreO = document.getElementById('score-o');
    const scorePlayer = document.getElementById('score-player');
    const scoreAI = document.getElementById('score-ai');
    const difficultySelectionTTT = document.getElementById('difficulty-selection-ttt');
    const difficultySelectionRPS = document.getElementById('difficulty-selection-rps');
    const memoryMatchBoard = document.getElementById('memory-match-board');
    const playModeSelectTTT = document.getElementById('play-mode-ttt');
    const playModeSelectRPS = document.getElementById('play-mode-rps');
    const playModeSelectMM = document.getElementById('play-mode-mm');
    const playModeSelectBubble = document.getElementById('play-mode-bubble');

    const moveSound = document.getElementById('move-sound');
    const winSound = document.getElementById('win-sound');
    const drawSound = document.getElementById('draw-sound');
    const choiceSound = document.getElementById('choice-sound');
    const resultSound = document.getElementById('result-sound');
    const popSound = document.getElementById('pop-sound');
    
    let ticTacToeState = Array(9).fill(null);
    let currentPlayer = 'X';
    let rpsDifficulty = 'easy';
    let memoryMatchDifficulty = 'easy';
    let ticTacToeScores = { X: 0, O: 0 };
    let rpsScores = { player: 0, ai: 0 };
    let isTicTacToePaused = false;
    let isRockPaperScissorsPaused = false;
    let isShootBubblePaused = false;
    let isMemoryMatchPaused = false;
    let memoryMatchState = [];
    let firstCard = null;
    let secondCard = null;
    let cardsFlipped = 0;
    let playModeTTT = 'friend'; // default play mode for Tic-Tac-Toe
    let playModeRPS = 'friend'; // default play mode for Rock-Paper-Scissors
    let playModeMM = 'friend'; // default play mode for Memory Match
    let playModeBubble = 'friend'; // default play mode for Shoot Bubble
    let bubbleTimer = null;
    let player1Time = 0;
    let player2Time = 0;
    let activePlayer = 1;

    const startGame = (game) => {
        gameSelection.style.display = 'none';
        document.getElementById(game).style.display = 'block';
        if (game === 'tic-tac-toe') createTicTacToeBoard();
        if (game === 'shoot-bubble') startBubbleGame();
        if (game === 'memory-match') createMemoryMatchBoard();
        if (game === 'snake') startSnakeGame();
        if (game === 'memory-squares') startMemorySquares();
        
    };

    const createTicTacToeBoard = () => {
        if (isTicTacToePaused) return;
        ticTacToeBoard.innerHTML = '';
        ticTacToeState.forEach((cell, index) => {
            const cellElement = document.createElement('div');
            cellElement.addEventListener('click', () => makeTicTacToeMove(index));
            cellElement.innerText = cell;
            ticTacToeBoard.appendChild(cellElement);
        });
    };

    const makeTicTacToeMove = (index) => {
        if (!ticTacToeState[index]) {
            ticTacToeState[index] = currentPlayer;
            moveSound.play();
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            createTicTacToeBoard();
            checkTicTacToeWinner();
            if (playModeTTT === 'ai' && currentPlayer === 'O') {
                setTimeout(makeAIMoveTicTacToe, 500); // AI makes a move after 500ms
            }
        }
    };

    const makeAIMoveTicTacToe = () => {
        const emptyCells = ticTacToeState.map((val, index) => val === null ? index : null).filter(val => val !== null);
        const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        makeTicTacToeMove(randomIndex);
    };

    const checkTicTacToeWinner = () => {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        let winner = null;
        winningCombinations.forEach(combination => {
            const [a, b, c] = combination;
            if (ticTacToeState[a] && ticTacToeState[a] === ticTacToeState[b] && ticTacToeState[a] === ticTacToeState[c]) {
                winner = ticTacToeState[a];
            }
        });
        if (winner) {
            winSound.play();
            alert(`Player ${winner} wins!`);
            ticTacToeScores[winner]++;
            updateScoreboardTicTacToe();
            resetGame('tic-tac-toe');
        } else if (!ticTacToeState.includes(null)) {
            drawSound.play();
            alert('It\'s a draw!');
            resetGame('tic-tac-toe');
        }
    };

    const updateScoreboardTicTacToe = () => {
        scoreX.innerText = ticTacToeScores.X;
        scoreO.innerText = ticTacToeScores.O;
    };

    const resetGame = (game) => {
        if (game === 'tic-tac-toe') {
            ticTacToeState = Array(9).fill(null);
            currentPlayer = 'X';
            createTicTacToeBoard();
        } else if (game === 'rock-paper-scissors') {
            rpsResult.innerHTML = '';
        } else if (game === 'shoot-bubble') {
            resetBubbleGame();
        } else if (game === 'memory-match') {
            resetMemoryMatch();
        } else if (game === 'snake') {
            startSnakeGame();
        }
    };

    const togglePause = (game) => {
        if (game === 'tic-tac-toe') {
            isTicTacToePaused = !isTicTacToePaused;
            if (!isTicTacToePaused) createTicTacToeBoard();
        } else if (game === 'rock-paper-scissors') {
            isRockPaperScissorsPaused = !isRockPaperScissorsPaused;
        } else if (game === 'shoot-bubble') {
            isShootBubblePaused = !isShootBubblePaused;
            if (!isShootBubblePaused) startBubbleGame();
        } else if (game === 'memory-match') {
            isMemoryMatchPaused = !isMemoryMatchPaused;
        } else if (game === 'snake') {
            if (snakeInterval) {
                clearInterval(snakeInterval);
                snakeInterval = null;
            } else {
                snakeInterval = setInterval(updateSnake, 100);
            }
        }
    };

    const playerChoice = (choice) => {
        if (isRockPaperScissorsPaused) return;
        choiceSound.play();
        const aiChoice = getAIChoiceRPS();
        const result = getRPSResult(choice, aiChoice);
        rpsResult.innerHTML = `You chose ${choice}. AI chose ${aiChoice}. ${result}`;
        resultSound.play();
        updateRPSScore(result);
    };

    const getAIChoiceRPS = () => {
        const choices = ['rock', 'paper', 'scissors'];
        if (rpsDifficulty === 'easy') {
            return choices[Math.floor(Math.random() * 3)];
        } else if (rpsDifficulty === 'normal') {
            return Math.random() < 0.5 ? choices[Math.floor(Math.random() * 3)] : getCounterMoveRPS();
        } else {
            return getCounterMoveRPS();
        }
    };

    const getCounterMoveRPS = () => {
        const choices = ['rock', 'paper', 'scissors'];
        const playerChoice = document.querySelector('.rps-button').innerText;
        if (playerChoice === 'rock') {
            return 'paper';
        } else if (playerChoice === 'paper') {
            return 'scissors';
        } else {
            return 'rock';
        }
    };

    const getRPSResult = (player, ai) => {
        if (player === ai) {
            return 'It\'s a draw!';
        } else if ((player === 'rock' && ai === 'scissors') || (player === 'paper' && ai === 'rock') || (player === 'scissors' && ai === 'paper')) {
            return 'You win!';
        } else {
            return 'You lose!';
        }
    };

    const updateRPSScore = (result) => {
        if (result === 'You win!') {
            rpsScores.player++;
        } else if (result === 'You lose!') {
            rpsScores.ai++;
        }
        scorePlayer.innerText = rpsScores.player;
        scoreAI.innerText = rpsScores.ai;
    };

    const changeDifficultyRPS = () => {
        rpsDifficulty = difficultySelectRPS.value;
    };

    const changeDifficultyMemoryMatch = () => {
        memoryMatchDifficulty = difficultySelectMM.value;
    };

    const goBack = () => {
        gameSelection.style.display = 'block';
        ticTacToeGame.style.display = 'none';
        rockPaperScissorsGame.style.display = 'none';
        shootBubbleGame.style.display = 'none';
        memoryMatchGame.style.display = 'none';
        snakeGame.style.display = 'none';
    };

    const startBubbleGame = () => {
        const canvas = document.getElementById('bubbleCanvas');
        const ctx = canvas.getContext('2d');
        let bubbles = [];
        const colors = ['#FF5733', '#33FF57', '#3357FF', '#FFFF33', '#FF33FF'];

        const createBubbles = (num) => {
            bubbles = [];
            for (let i = 0; i < num; i++) {
                const radius = Math.random() * 20 + 10;
                const x = Math.random() * (canvas.width - radius * 2) + radius;
                const y = Math.random() * (canvas.height - radius * 2) + radius;
                const dx = (Math.random() - 0.5) * 2;
                const dy = (Math.random() - 0.5) * 2;
                const color = colors[Math.floor(Math.random() * colors.length)];
                bubbles.push({ x, y, dx, dy, radius, color });
            }
        };

        const drawBubbles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            bubbles.forEach(bubble => {
                ctx.beginPath();
                ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
                ctx.fillStyle = bubble.color;
                ctx.fill();
                ctx.closePath();
            });
        };

        const updateBubbles = () => {
            bubbles.forEach(bubble => {
                bubble.x += bubble.dx;
                bubble.y += bubble.dy;

                if (bubble.x + bubble.radius > canvas.width || bubble.x - bubble.radius < 0) {
                    bubble.dx = -bubble.dx;
                }

                if (bubble.y + bubble.radius > canvas.height || bubble.y - bubble.radius < 0) {
                    bubble.dy = -bubble.dy;
                }
            });
        };

        const animateBubbles = () => {
            if (isShootBubblePaused) return;
            requestAnimationFrame(animateBubbles);
            updateBubbles();
            drawBubbles();
        };

        canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            bubbles.forEach((bubble, index) => {
                const dist = Math.hypot(bubble.x - x, bubble.y - y);
                if (dist - bubble.radius < 1) {
                    bubbles.splice(index, 1);
                    popSound.play();
                    if (bubbles.length === 0) {
                        stopBubbleTimer();
                    }
                }
            });
        });

        createBubbles(20);
        animateBubbles();
        startBubbleTimer();
    };

    const startBubbleTimer = () => {
        const timerElement = activePlayer === 1 ? document.getElementById('time-player1') : document.getElementById('time-player2');
        bubbleTimer = setInterval(() => {
            if (activePlayer === 1) {
                player1Time++;
                timerElement.innerText = player1Time;
            } else {
                player2Time++;
                timerElement.innerText = player2Time;
            }
        }, 1000);
    };

    const stopBubbleTimer = () => {
        clearInterval(bubbleTimer);
        if (activePlayer === 1) {
            activePlayer = 2;
            alert("Player 1's turn is over. Player 2's turn starts now!");
            startBubbleGame();
        } else {
            setTimeout(() => {
                const winner = player1Time < player2Time ? 'Player 1' : 'Player 2';
                alert(`${winner} wins!`);
                resetGame('shoot-bubble');
            }, 500);
        }
    };

    const resetBubbleGame = () => {
        player1Time = 0;
        player2Time = 0;
        activePlayer = 1;
        startBubbleGame();
    };

    const createMemoryMatchBoard = () => {
        if (isMemoryMatchPaused) return;
        memoryMatchBoard.innerHTML = '';
        const cards = [
            '🍎', '🍌', '🍇', '🍉', '🍒', '🍓', '🍍', '🥭',
            '🍎', '🍌', '🍇', '🍉', '🍒', '🍓', '🍍', '🥭'
        ];
        memoryMatchState = cards.sort(() => 0.5 - Math.random()).map(card => ({
            value: card,
            matched: false,
            element: createCardElement(card)
        }));
        memoryMatchState.forEach(card => memoryMatchBoard.appendChild(card.element));
    };

    const createCardElement = (value) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.addEventListener('click', () => flipCard(cardElement));
        return cardElement;
    };

    const flipCard = (cardElement) => {
        if (isMemoryMatchPaused || cardElement.classList.contains('matched') || cardElement === firstCard || cardElement === secondCard) return;
        cardElement.innerText = memoryMatchState.find(card => card.element === cardElement).value;
        if (!firstCard) {
            firstCard = cardElement;
        } else if (!secondCard) {
            secondCard = cardElement;
            checkForMatch();
        }
    };

    const checkForMatch = () => {
        const firstCardValue = memoryMatchState.find(card => card.element === firstCard).value;
        const secondCardValue = memoryMatchState.find(card => card.element === secondCard).value;
        if (firstCardValue === secondCardValue) {
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
            memoryMatchState.find(card => card.element === firstCard).matched = true;
            memoryMatchState.find(card => card.element === secondCard).matched = true;
            firstCard = null;
            secondCard = null;
            cardsFlipped += 2;
            if (cardsFlipped === memoryMatchState.length) {
                setTimeout(() => {
                    alert('You win!');
                    resetMemoryMatch();
                }, 500);
            }
        } else {
            setTimeout(() => {
                firstCard.innerText = '';
                secondCard.innerText = '';
                firstCard = null;
                secondCard = null;
            }, 1000);
        }
    };

    const resetMemoryMatch = () => {
        firstCard = null;
        secondCard = null;
        cardsFlipped = 0;
        createMemoryMatchBoard();
    };

    const changePlayModeTicTacToe = () => {
        playModeTTT = playModeSelectTTT.value;
        difficultySelectionTTT.style.display = playModeTTT === 'ai' ? 'block' : 'none';
        resetGame('tic-tac-toe');
    };

    const changeDifficultyTicTacToe = () => {
        // Handle AI difficulty change if needed
    };

    const changePlayModeRPS = () => {
        playModeRPS = playModeSelectRPS.value;
        difficultySelectionRPS.style.display = playModeRPS === 'ai' ? 'block' : 'none';
        resetGame('rock-paper-scissors');
    };

    const changePlayModeMemoryMatch = () => {
        playModeMM = playModeSelectMM.value;
        difficultySelectMM.style.display = playModeMM === 'ai' ? 'block' : 'none';
        resetGame('memory-match');
    };

    const changePlayModeBubble = () => {
        playModeBubble = playModeSelectBubble.value;
        resetGame('shoot-bubble');
    };

    // Snake Game
    const snakeCanvas = document.getElementById('snakeCanvas');
    const ctx = snakeCanvas.getContext('2d');
    const gridSize = 20;
    let snake = [{x: 5, y: 5}];
    let food = {x: 10, y: 10};
    let direction = {x: 0, y: 0};
    let snakeInterval;

    const startSnakeGame = () => {
        direction = {x: 0, y: 1};
        snake = [{x: 5, y: 5}];
        placeFood();
        snakeInterval = setInterval(updateSnake, 100);
    };

    const placeFood = () => {
        food = {
            x: Math.floor(Math.random() * gridSize),
            y: Math.floor(Math.random() * gridSize)
        };
    };

    const updateSnake = () => {
        const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};
        if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize || snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            clearInterval(snakeInterval);
            alert('Game Over');
            return;
        }
        snake.unshift(head);
        if (head.x === food.x && head.y === food.y) {
            placeFood();
        } else {
            snake.pop();
        }
        drawSnake();
    };

    const drawSnake = () => {
        ctx.clearRect(0, 0, snakeCanvas.width, snakeCanvas.height);
        ctx.fillStyle = 'green';
        snake.forEach(segment => {
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        });
        ctx.fillStyle = 'red';
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
    };

    const handleKeydown = (event) => {
        switch(event.key) {
            case 'ArrowUp':
                if (direction.y === 0) direction = {x: 0, y: -1};
                break;
            case 'ArrowDown':
                if (direction.y === 0) direction = {x: 0, y: 1};
                break;
            case 'ArrowLeft':
                if (direction.x === 0) direction = {x: -1, y: 0};
                break;
            case 'ArrowRight':
                if (direction.x === 0) direction = {x: 1, y: 0};
                break;
        }
    };

    const cells = document.querySelectorAll('#memory-squares .cell');
let sequence = [];
let playerSequence = [];
let level = 1;

const startMemorySquares = () => {
    generateSequence();
    highlightSequence();
};

const generateSequence = () => {
    sequence = [];
    for (let i = 0; i < level; i++) {
        sequence.push(Math.floor(Math.random() * 9));
    }
};

const highlightSequence = () => {
    let delay = 500;

    sequence.forEach((id, index) => {
        setTimeout(() => {
            cells[id].classList.add('active');
            setTimeout(() => {
                cells[id].classList.remove('active');
            }, 500);
        }, delay * (index + 1));
    });

    setTimeout(() => {
        playerSequence = [];
        cells.forEach(cell => cell.addEventListener('click', handlePlayerClick));
    }, delay * (sequence.length + 1));
};

const handlePlayerClick = (event) => {
    const clickedId = parseInt(event.target.dataset.id);
    playerSequence.push(clickedId);
    event.target.classList.add('clicked');
    setTimeout(() => {
        event.target.classList.remove('clicked');
    }, 300);

    if (playerSequence[playerSequence.length - 1] !== sequence[playerSequence.length - 1]) {
        alert('Game Over! Try Again.');
        level = 1;
        startMemorySquares();
        return;
    }

    if (playerSequence.length === sequence.length) {
        level++;
        cells.forEach(cell => cell.removeEventListener('click', handlePlayerClick));
        setTimeout(() => {
            startMemorySquares();
        }, 1000);
    }
};
    document.addEventListener('keydown', handleKeydown);

    window.startGame = startGame;
    window.playerChoice = playerChoice;
    window.resetGame = resetGame;
    window.togglePause = togglePause;
    window.goBack = goBack;
    window.changePlayModeTicTacToe = changePlayModeTicTacToe;
    window.changeDifficultyTicTacToe = changeDifficultyTicTacToe;
    window.changePlayModeRPS = changePlayModeRPS;
    window.changePlayModeMemoryMatch = changePlayModeMemoryMatch;
    window.changeDifficultyMemoryMatch = changeDifficultyMemoryMatch;
    window.changePlayModeBubble = changePlayModeBubble;
});
