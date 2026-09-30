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

const gameBoard = document.createElement('div');
gameBoard.classList.add('game-board');
app.append(gameBoard);


const shuffledCards = shuffleCards(cards);

shuffledCards.forEach((image) => {
    const card = document.createElement('button');
    card.classList.add('card');
    card.addEventListener('click', () => {
        card.textContent = card.dataset.image;
        card.classList.add('flipped');
      });
    gameBoard.append(card);
    card.dataset.image = image;
    
  });