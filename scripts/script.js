// Pads -----------------------------------------------------------------------

const pads = document.querySelectorAll('.board__pad')

// Visual  --------------------------------------------------------------------

const userInterface = {
  $counter: document.querySelector('#counter__screen'),
  $counterNumbers: document.querySelector('#counter-numbers'),
  $strictLed: document.querySelector('#strict-led'),
  $startLed: document.querySelector('#start-led'),
  $onLabel: document.querySelector('#on-label')
}

// Controls --------------------------------------------------------------------

const controls = {
  $startButton: document.querySelector('#start-btn'),
  $powerButton: document.querySelector('#power-btn'),
  $strictButton: document.querySelector('#strict-btn')
}

// Game Variables -------------------------------------------------------------

const gameData = {
  powerOn: false,
  strictMode: false,
  startGame: false,
  moves: undefined,
  gameSequence: [],
  playerSequence: [],
  playerTurn: false,
  sounds: [],
  timeout: undefined
}

const soundsUrls = [
  'audios/simonSound1.mp3',
  'audios/simonSound2.mp3',
  'audios/simonSound3.mp3',
  'audios/simonSound4.mp3'
].forEach(soundPath => {
  const audio = new Audio(soundPath)
  gameData.sounds.push(audio)
})
//  Listeners -----------------------------------------------------------------

// Controls 

// -- Power --
controls.$powerButton.addEventListener('click', (event) => {
  gameData.powerOn = controls.$powerButton.classList.toggle('btn__switch--active');
  userInterface.$onLabel.classList.toggle('gui__label--switch-on');
  userInterface.$counterNumbers.classList.add('counter__numbers');
  userInterface.$counterNumbers.innerHTML = '--';

  if (!gameData.powerOn) {
    userInterface.$counterNumbers.innerHTML = '';
    userInterface.$startLed.classList.remove('start-led--on');
    userInterface.$strictLed.classList.remove('strict-led--on');
  }

  gameData.strictMode = false;
  gameData.moves = 0;
  gameData.playerTurn = false;
  gameData.gameSequence = [];
  gameData.playerSequence = [];

  disablePads()
  handleCursor('auto')

})

// -- Start --
controls.$startButton.addEventListener('click', (event) => {
  if (!gameData.powerOn) return;
  if (gameData.startGame) {
    gameData.strictMode = false;
    gameData.moves = 0;
    gameData.playerTurn = false;
    gameData.gameSequence = [];
    gameData.playerSequence = [];
    gameData.startGame = userInterface.$startLed.classList.toggle('start-led--on');
    userInterface.$counterNumbers.innerHTML = '--'
    return
  }
  startGame();
  gameData.startGame = userInterface.$startLed.classList.toggle('start-led--on');

})

// -- Strict --
controls.$strictButton.addEventListener('click', (event) => {
  if (!gameData.powerOn) return;
  gameData.strictMode = userInterface.$strictLed.classList.toggle('strict-led--on');

})

// Pads

pads.forEach((pad, index) => {
  pad.addEventListener('click', padListener)
});

function padListener(event) {
  if (!gameData.playerTurn) return;
  let soundId;
  pads.forEach((pad, index) => {
    if (pad === event.target) soundId = index;
  })
  event.target.classList.add('board__pad--active')
  gameData.sounds[soundId].play()
  gameData.playerSequence.push(soundId)
  setTimeout(() => {
    event.target.classList.remove('board__pad--active')
    const currentMove = gameData.playerSequence.length - 1;
    if (gameData.playerSequence[currentMove] !== gameData.gameSequence[currentMove]) {
      gameData.playerTurn = false
      disablePads()
      handleStrictmode()
    } else if (currentMove === gameData.gameSequence.length - 1) {
      generateGameSequence()
      startGameSequence()
    }
  }, 250)
}

function handleCursor(cursorType) {
  pads.forEach(pad => {
    pad.style.cursor = cursorType
  })
}

//  ===========================================================================

function startGame() {
  flashMovesCounter('--', () => {
    generateGameSequence();
    startGameSequence();
  })
}

function generateGameSequence() {
  if (gameData.moves === 20) {
    flashMovesCounter('**', startGame);
    return
  }
  gameData.gameSequence.push(Math.floor(Math.random() * 4));
  gameData.moves++;
  setMoves();
}

function setMoves() {
  const moves = gameData.moves.toString();
  const displayMoves = '00'.substring(0, 2 - moves.length) + moves;
  userInterface.$counterNumbers.innerHTML = displayMoves;
}

function startGameSequence() {
  let counter = 0;
  let padOn = true;
  gameData.playerSequence = [];
  gameData.playerTurn = false

  handleCursor('auto')

  const interval = setInterval(() => {
    if (!gameData.powerOn) {
      clearInterval(interval);
      disablePads()
      return
    }
    if (padOn) {
      if (counter === gameData.gameSequence.length) {
        clearInterval(interval);
        disablePads();
        waitForPlayerMove();
        handleCursor('pointer')
        gameData.playerTurn = true;
        return;
      }
      const soundId = gameData.gameSequence[counter];
      const pad = pads[soundId]
      gameData.sounds[soundId].play();
      pad.classList.add('board__pad--active');
      counter++
    } else {
      disablePads()
    }
    padOn = !padOn
  }, 500)
}

function waitForPlayerMove() {
  clearTimeout(gameData.timeout)
  gameData.timeout = setTimeout(() => {
    if (!gameData.playerTurn) return;
    disablePads()
    handleStrictmode()
  }, 5000);
}

function handleStrictmode() {
  gameData.playerTurn = false;
  if (gameData.strictMode) {
    flashMovesCounter('!!', () => {
      gameData.moves = 0;
      gameData.gameSequence = [];
      startGame()
    })
  } else {
    flashMovesCounter('!!', () => {
      setMoves()
      startGameSequence()
    })
  }
}

function disablePads() {
  pads.forEach(pad => pad.classList.remove('board__pad--active'));
}

function flashPad(pad) {
  if (!gameData.powerOn) return;
  pad.classList.add('board__pad--active');
  setInterval(() => {
    pad.classList.remove('board__pad--active');
  }, 150)
}

function flashMovesCounter(text, callback) {
  let counter = 0;
  let on = true;
  userInterface.$counterNumbers.innerHTML = text;
  const interval = setInterval(() => {
    if (!gameData.powerOn) return clearInterval(interval)
    if (on) {
      userInterface.$counterNumbers.classList.remove('counter__numbers');
    } else {
      userInterface.$counterNumbers.classList.add('counter__numbers');
      if (++counter === 3) {
        clearInterval(interval);
        callback();
      }
    }
    on = !on;
  }, 250)
}



