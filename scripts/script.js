// Pads -----------------------------------------------------------------------
const $topLeftPad = document.querySelector('#board__pad--tl');
const $topRightPad = document.querySelector('#board__pad--tr');
const $bottomLeftPad = document.querySelector('#board__pad--bl');
const $bottomRightPad = document.querySelector('#board__pad--br');

// Counter --------------------------------------------------------------------
const $counter = document.querySelector('#counter__screen');

// Buttons --------------------------------------------------------------------
const $startButton = document.querySelector('#start');
const $powerButton = document.querySelector('#power');
const $strictButton = document.querySelector('#strict');

const $slider = document.querySelector('.slider')

// Game Variables -------------------------------------------------------------

let order = [];
let playerOrder = [];
let flash;
let turn;
let good;
let compTurn;
let intervalId;
let strict = false;
let noise = true;
let on = false;
let win

//  Listeners -----------------------------------------------------------------

$powerButton.addEventListener('click', (e) => {
  if ($powerButton.checked) {
    on = true;
    $counter.innerHTML = '--';
  } else {
    on = false
    $counter.innerHTML = ''
    clearColor()
    clearInterval(intervalId)
  }
});

$strictButton.addEventListener('click', (e) => {
  $strictButton.checked ? strict = true : strict = false
});

$startButton.addEventListener('click', (e) => {
  if (on || win) {
    play()
  }
});

$topLeftPad.addEventListener('click', (e) => {
  if (on) {
    playerOrder.push(1)
    check()
    one()
    if (!win) {
      setTimeout(() => {
        clearColor()
      }, 300)
    }
  }
})

$topRightPad.addEventListener('click', (e) => {
  if (on) {
    playerOrder.push(2)
    check()
    two()
    if (!win) {
      setTimeout(() => {
        clearColor()
      }, 300)
    }
  }
})

$bottomRightPad.addEventListener('click', (e) => {
  if (on) {
    playerOrder.push(3)
    check()
    three()
    if (!win) {
      setTimeout(() => {
        clearColor()
      }, 300)
    }
  }
})

$bottomLeftPad.addEventListener('click', (e) => {
  if (on) {
    playerOrder.push(4)
    check()
    four()
    if (!win) {
      setTimeout(() => {
        clearColor()
      }, 300)
    }
  }
})


// Utils ----------------------------------------------------------------------

function clearColor() {
  $topLeftPad.style.opacity = .5
  $topRightPad.style.opacity = .5
  $bottomRightPad.style.opacity = .5
  $bottomLeftPad.style.opacity = .5
}

function play() {
  win = false;
  order = [];
  playerOrder = [];
  flash = 0;
  intervalId = 0;
  turn = 1;
  good = true
  $counter.innerHTML = 1;

  for (let i = 0; i < 20; i++) {
    order.push(Math.floor(Math.random() * 4) + 1);
  }

  compTurn = true;
  intervalId = setInterval(gameTurn, 800)
}

function gameTurn() {
  on = false

  if (flash === turn) {
    clearInterval(intervalId);
    compTurn = false;
    clearColor();
    on = true
  }

  if (compTurn) {
    clearColor();
    setTimeout(() => {
      if (order[flash] === 1) one();
      if (order[flash] === 2) two();
      if (order[flash] === 3) three();
      if (order[flash] === 4) four();
      flash++
    }, 200);
  }
}

function one() {
  if (noise) {
    let audio = document.getElementById('audio1')
    audio.play()
  }
  $topLeftPad.style.opacity = 1
}
function two() {
  if (noise) {
    let audio = document.getElementById('audio2')
    audio.play()
  }
  $topRightPad.style.opacity = 1

}
function three() {
  if (noise) {
    let audio = document.getElementById('audio3')
    audio.play()
  }
  $bottomRightPad.style.opacity = 1

}
function four() {
  if (noise) {
    let audio = document.getElementById('audio4')
    audio.play()
  }
  $bottomLeftPad.style.opacity = 1
}

function check() {
  if (playerOrder[playerOrder.length - 1] !== order[playerOrder.length - 1]) good = false;

  if (playerOrder.length === 20 && good) winGame()

  if (!good) {
    flashColor()
    $counter.innerHTML = 'NO'
    setTimeout(() => {
      $counter.innerHTML = turn;
      clearColor();
      if (strict) {
        play()
      } else {
        compTurn = true;
        flash = 0;
        playerOrder = [];
        good = true;
        intervalId = setInterval(gameTurn, 800)

      }
    }, 800);
    // noise = false
  }

  if (turn === playerOrder.length && good && !win) {
    turn++;
    playerOrder = [];
    compTurn = true;
    flash = 0;
    $counter.innerHTML = turn
    intervalId = setInterval(gameTurn, 800)
  }
}

function flashColor() {
  $topLeftPad.style.opacity = 1;
  $topRightPad.style.opacity = 1;
  $bottomRightPad.style.opacity = 1;
  $bottomLeftPad.style.opacity = 1;
}

function winGame() {
  flashColor();
  $counter.innerHTML = 'WIN'
  on = false
  win = true
}