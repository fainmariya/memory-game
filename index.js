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
                saveResult();
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
  function saveResult() {
    const result = {
      moves,
      time: timeCount
    };
  
    const savedResults = localStorage.getItem('memoryGameResults');
    const results = savedResults ? JSON.parse(savedResults) : [];
  
    results.push(result);
    results.sort((a, b) => {
        if (a.moves !== b.moves) {
          return a.moves - b.moves;
        }
      
        return a.time - b.time;
      });
      const topResults = results.slice(0, 10);
  
    localStorage.setItem('memoryGameResults', JSON.stringify(topResults));
  }
  function createLeaderboardModal() {
    const savedResults = localStorage.getItem('memoryGameResults');
    const results = savedResults ? JSON.parse(savedResults) : [];
    const modalOverlay = document.createElement('div');
    modalOverlay.classList.add('modal-overlay');
    
    const leaderboardModal = document.createElement('div');
    leaderboardModal.classList.add ('leaderboard-modal');
    modalOverlay.append(leaderboardModal);

    const leaderboardTitle = document.createElement('h2');
    leaderboardTitle.classList.add('leaderboard-title');
    leaderboardTitle.textContent = 'Leaderboard 🏆';
    leaderboardModal.append(leaderboardTitle);

    if (results.length === 0) {
        const emptyResult = document.createElement('p');
        emptyResult.classList.add('leaderboard-result');
        emptyResult.textContent = 'No results yet';
        leaderboardModal.append(emptyResult);
     }
    results.forEach((result, index) => {
        const resultItem = document.createElement('p');
        resultItem.classList.add('leaderboard-result');
        const minutes = Math.floor(result.time / 60);
        const seconds = result.time % 60;

        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');
        resultItem.textContent = `${index + 1}. Moves: ${result.moves} | Time: ${formattedMinutes}:${formattedSeconds}`;
        leaderboardModal.append(resultItem);
    });
    const closeButton = document.createElement('button');
    closeButton.classList.add('leaderboard-close');
    closeButton.textContent = 'Close';
    leaderboardModal.append(closeButton);
    closeButton.addEventListener('click', () => {
       modalOverlay.remove();
})

document.body.append(modalOverlay);
    
  }
  leaderboardButton.addEventListener('click', () => {
    createLeaderboardModal();
  });