let player1Time, player2Time, increment;
let time1, time2;
let timerInterval;
let activePlayer = 1; // Player 1 (White) starts as the active player
let gameEnded = false; // Flag to indicate if the game has ended
let gameStarted = false; // Flag to indicate if the game has started

// Elements
const time1El = document.getElementById('time1');
const time2El = document.getElementById('time2');
const player1El = document.getElementById('player1');
const player2El = document.getElementById('player2');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const setupDiv = document.querySelector('.setup');
const clockDiv = document.querySelector('.chess-clock');
const resultDiv = document.createElement('div'); // Div to display the result message
resultDiv.classList.add('result'); // Add some class for styling
document.body.appendChild(resultDiv); // Append it to the body

// Convert minutes and seconds to deciseconds
function convertToDeciseconds(minutes, seconds) {
    return (minutes * 60 * 10) + (seconds * 10);
}

// Convert deciseconds to MM:SS:DS format
function formatTime(deciseconds) {
    const min = Math.floor(deciseconds / 600);
    const sec = Math.floor((deciseconds % 600) / 10);
    const decisec = deciseconds % 10;
    return `${min}:${sec < 10 ? '0' : ''}${sec}:${decisec}`;
}

// End the game and declare the winner
function endGame(winner) {
    clearInterval(timerInterval); // Stop the clock
    gameEnded = true; // Set the game-ended flag to true

    if (winner === 1) {
        resultDiv.textContent = "White Wins!";
        player1El.style.backgroundColor = "green";
        player2El.style.backgroundColor = "darkgray";
    } else {
        resultDiv.textContent = "Black Wins!";
        player2El.style.backgroundColor = "green";
        player1El.style.backgroundColor = "darkgray";
    }

    resultDiv.style.display = "block"; // Show the result message
}

// Start the clock for the active player
function startClock() {
    timerInterval = setInterval(() => {
        if (activePlayer === 1) {
            time1--;
            time1El.textContent = formatTime(time1);
            if (time1 <= 0) {
                clearInterval(timerInterval); // Stop Player 1's clock
                endGame(2); // Player 2 wins if Player 1's time runs out
            }
        } else {
            time2--;
            time2El.textContent = formatTime(time2);
            if (time2 <= 0) {
                clearInterval(timerInterval); // Stop Player 2's clock
                endGame(1); // Player 1 wins if Player 2's time runs out
            }
        }
    }, 100); // Update every decisecond (100ms)
}

// Toggle active player
function togglePlayer() {
    if (gameEnded) return; // Prevent toggling after the game has ended

    clearInterval(timerInterval);
    
    // Play notification sound
    const notifySound = document.getElementById('notifySound');
    notifySound.play();
    
    // Apply increment to the current player (active player)
    if (activePlayer === 1) {
        time1 += parseInt(increment) * 10; // Add increment to Player 1's time (in deciseconds)
        player1El.style.backgroundColor = "darkgray"; // Change background to indicate inactive
        player2El.style.backgroundColor = "green"; // Change Player 2's background to active
        activePlayer = 2; // Switch to Player 2
    } else {
        time2 += parseInt(increment) * 10; // Add increment to Player 2's time (in deciseconds)
        player1El.style.backgroundColor = "green"; // Change Player 1's background to active
        player2El.style.backgroundColor = "darkgray"; // Change Player 2's background to inactive
        activePlayer = 1; // Switch to Player 1
    }
    
    // Start the clock for the new active player
    startClock();
}

// Start the game after setting up the times
startButton.addEventListener('click', () => {
    const player1Minutes = parseInt(document.getElementById('player1Minutes').value);
    const player1Seconds = parseInt(document.getElementById('player1Seconds').value);
    const player2Minutes = parseInt(document.getElementById('player2Minutes').value);
    const player2Seconds = parseInt(document.getElementById('player2Seconds').value);
    increment = document.getElementById('increment').value;

    // Convert times to deciseconds
    time1 = convertToDeciseconds(player1Minutes, player1Seconds);
    time2 = convertToDeciseconds(player2Minutes, player2Seconds);

    // Set the initial display times
    time1El.textContent = formatTime(time1);
    time2El.textContent = formatTime(time2);

    // Hide the setup div and show the chess clock
    setupDiv.classList.add('hidden');
    clockDiv.classList.remove('hidden');

    // Start the clock for Player 1 (White) immediately when the game starts
    activePlayer = 1; // Ensure Player 1 is active
});

// Switch player on spacebar press
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        if (!gameStarted) {
            // If the game hasn't started yet, we start with Player 1
            activePlayer = 1; // Ensure Player 1 (White) starts
            startClock(); // Start the clock when the spacebar is pressed
            gameStarted = true; // Mark the game as started
        } else {
            togglePlayer(); // Toggle the player
        }
    }
});

// Pause button functionality
pauseButton.addEventListener('click', () => {
    clearInterval(timerInterval); // Stop the clock
});
