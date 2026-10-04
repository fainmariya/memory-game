const cardImages = [
    '🍓', '🍋', '🍇', '🥝', '🍒', '🍉', '🍍', '🥥'
  ];
const cards = [...cardImages, ...cardImages];

function shuffleCards(cards) {
    for (let i = cards.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i],cards[j]] = [cards[j], cards[i]];
         
    }
    return cards;

  }

const app = document.createElement('div');
app.classList.add('memory-game');
document.body.append(app);

const header = document.createElement('header');
header.classList.add('game-header');

app.append(header);

const title = document.createElement('h1');
title.classList.add('game-title');
title.textContent = 'Memory Game';
header.append(title);

const newGameButton = document.createElement('button');
newGameButton.classList.add('header-button');
newGameButton.textContent = 'New Game';
header.append(newGameButton);

const leaderboardButton = document.createElement('button');
leaderboardButton.classList.add('header-button');
leaderboardButton.textContent = 'Leaderboard';
header.append(leaderboardButton);

const stats = document.createElement('div');
stats.classList.add('game-stats');
app.append(stats);

const movesElement = document.createElement('p');
movesElement.classList.add('moves');
movesElement.textContent = 'Moves: 0';
stats.append(movesElement);

const pairsElement = document.createElement('p');
pairsElement.classList.add('pairs');
pairsElement.textContent = 'Pairs: 0 / 8';
stats.append(pairsElement);

const timerElement = document.createElement('p');
timerElement.classList.add('timer');
timerElement.textContent = 'Time: 00:00';
stats.append(timerElement);

const gameBoard = document.createElement('div');
gameBoard.classList.add('game-board');
app.append(gameBoard);

let firstCard = null;
let isBoardLocked = false;
let isTimerStarted = false;
let matchedPairs = 0;
let moves = 0;
let timerId = 0;
let timeCount = 0;
let intervalId = 0;

function createGameBoard() {
  const newCards = [...cards];
  const shuffledCards = shuffleCards(newCards);
  
  shuffledCards.forEach((image) => {
    const card = document.createElement('button');
    card.classList.add('card');
    card.dataset.image = image;
    card.addEventListener('click', () => {
        if (isBoardLocked) {
            return;
        }
        if (card.classList.contains('flipped')) {
            return;
        }
        if (!isTimerStarted) {
            startTimer();
            isTimerStarted = true
        }
       
        card.textContent = card.dataset.image;
        card.classList.add('flipped');

        if (firstCard === null) {
            firstCard = card;
            return;
          }
        const secondCard = card;
        moves += 1;
        movesElement.textContent = `Moves: ${moves}`;

        if (firstCard.dataset.image === secondCard.dataset.image) {
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
            matchedPairs += 1;
            
            pairsElement.textContent =`Pairs: ${matchedPairs}/8`;
            if (matchedPairs === 8) {
                clearInterval(intervalId);
                isTimerStarted = false;
                isBoardLocked = true;
                createVictoryModal();
            }
                
            firstCard = null;
            return;
        }
        
        isBoardLocked = true;
        timerId = setTimeout(() => {
            firstCard.textContent = '';
            secondCard.textContent = '';
            
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            
            firstCard = null;
            isBoardLocked = false
            
        }, 1000);

        
      });
    gameBoard.append(card);
    
  });

  
}
createGameBoard();

newGameButton.addEventListener('click', () => {
    resetGame()
  });
  
  function startTimer() {
    intervalId = setInterval(() => {
      timeCount += 1;
  
      const minutes = Math.floor(timeCount / 60);
      const seconds = timeCount % 60;
  
      const formattedMinutes = String(minutes).padStart(2, '0');
      const formattedSeconds = String(seconds).padStart(2, '0');
  
      timerElement.textContent =
        `Time: ${formattedMinutes}:${formattedSeconds}`;
    }, 1000);
  }
  function createVictoryModal() {
    const modalOverlay = document.createElement('div');
    modalOverlay.classList.add('modal-overlay');
    const victoryModal = document.createElement('div');
    victoryModal.classList.add('victory-modal');
    const victoryTitle = document.createElement('h2');
    victoryTitle.classList.add('victory-title');
    victoryTitle.textContent = 'You Win! 🎉';
    const victoryTime = document.createElement('p');
    victoryTime.classList.add('victory-result');

    const minutes = Math.floor(timeCount / 60);
    const seconds = timeCount % 60;

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    victoryTime.textContent = `Time: ${formattedMinutes}:${formattedSeconds}`;

    const victoryMoves = document.createElement('p');
    victoryMoves.classList.add('victory-result');
    victoryMoves.textContent = `Moves: ${moves}`;

    const restartButton = document.createElement('button');
    restartButton.classList.add('victory-button');
    restartButton.textContent = 'Restart';
    
    victoryModal.append(victoryTitle);
    victoryModal.append(victoryTime, victoryMoves);
    victoryModal.append(restartButton);
    modalOverlay.append(victoryModal);
    document.body.append(modalOverlay);
    restartButton.addEventListener('click', () => {
      modalOverlay.remove();
      resetGame();
    })

  }
  function resetGame() {
    clearTimeout(timerId);
    clearInterval(intervalId);
  
    gameBoard.replaceChildren();
  
    firstCard = null;
    isBoardLocked = false;
    matchedPairs = 0;
    moves = 0;
    timeCount = 0;
    isTimerStarted = false;
  
    timerId = 0;
    intervalId = 0;
  
    movesElement.textContent = `Moves: ${moves}`;
    pairsElement.textContent = `Pairs: ${matchedPairs}/8`;
    timerElement.textContent = 'Time: 00:00';
  
    createGameBoard();
  }
  