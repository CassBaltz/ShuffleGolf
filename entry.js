const Constants = require('./constants');
const slidebars = require('./Slidebars-2.0.2/dist/slidebars')

let canvasBoard = document.getElementById("canvasBoard");
let ctx = canvasBoard.getContext("2d");
let canvasPower = document.getElementById("canvasPower");
let ctxPower = canvasPower.getContext("2d");
let canvasAim = document.getElementById("canvasAim");
let ctxAim = canvasAim.getContext("2d");

let obstNotBuilt = true;
let ballRadius = Constants.BALL_RADIUS;
let xPos = Constants.CANVAS_WIDTH/2;
let yPos = 15 + ballRadius;
let yHoleStart = Constants.CANVAS_HEIGHT - (3*Constants.HOLE_RADIUS);
let holeRadius = Constants.HOLE_RADIUS;
let strokes;
let initialPower = 0;
let deltX = 0;
let deltY = 0;
let onSwing = false;
let mouseX, ballX, ballY, mouseY;
let masterRadians, masterPower;
let obstArray = [];
let level = 1;
let remainingTurns;
let text;
window.mouseX
window.mouseY

canvasBoard.addEventListener("mousedown", (function(e) {
    filterClick(e);
}));

window.addEventListener("mousemove", (function(e) {
  updatePos(e);
}));

function filterClick(e) {
  e.preventDefault();
  if (((xPos - ballRadius) <= e.offsetX && e.offsetX <= (xPos + ballRadius)) && ((yPos - ballRadius) <= e.offsetY && e.offsetY <= (yPos + ballRadius))) {
    // debugger//run the function to get speed and direction
    ballX = window.mouseX;
    ballY = window.mouseY;
    onSwing = true;
    swing(ballX, ballY)
  }
};

function strikeBall(xEnd, yEnd) {
  ctxPower.clearRect(0, 0, Constants.CP_WIDTH, Constants.CP_HEIGHT);
  ctxAim.clearRect(0, 0, Constants.CA_WIDTH, Constants.CA_HEIGHT);
  let xDif = (xEnd > ballX) ? (xEnd - ballX) : (ballX - xEnd);
  let yDif = (yEnd > ballY) ? (yEnd - ballY) : (ballY - yEnd);
  let pyth = (xDif * xDif) + (yDif * yDif);
  let tot = Math.floor(Math.sqrt(pyth));


  console.log(`masterPower= ${masterPower}`);
  console.log(`masterRadians= ${Math.tan(masterRadians)}`);
  // console.log(`yPos=${yPos}`);
  // console.log(`yEnd=${yEnd}`);
  // console.log(tot)
  // console.log(xDif/yDif);

  if (tot < 5) {
    console.log("too small")
    return;
  } else if (tot > 150) {
    initialPower = 150;
    strokes --;
    window.draw = setInterval(draw, 10);
    drawStats();
  } else {
    initialPower = tot;
    strokes --;
    window.draw = setInterval(draw, 10);
    drawStats();
  }

  deltX = (Math.cos(masterRadians));
  deltY = (Math.sin(masterRadians));

  // console.log(tot)
}

function updatePos(e) {
  window.mouseX = e.screenX;
  window.mouseY = e.screenY;
}

function swing(xInit, yInit) {

  this.addEventListener("mouseup", (function() {
    clearInterval(window.drawHitDetailInterval);
    if (onSwing) {
      strikeBall(window.mouseX, window.mouseY)
      onSwing = false;
    }
    onSwing = false;
  }));

  window.drawHitDetailInterval = setInterval(function() {drawHitDetails(xInit, yInit, window.mouseX, window.mouseY)}, 5);
};

function buildObstacles (level) {
  let i, x, y, dx, dy, distance;
  let status = true;
  i = 0;
  while (i < (level + 3)) {
    if (i === 0) {
      x = Constants.CANVAS_WIDTH / 2;
    } else {
      x = Math.floor(Math.random() * ((Constants.CANVAS_WIDTH - (Constants.OBS_RAD)) - (Constants.OBS_RAD)) + (Constants.OBS_RAD));
    }
    y = Math.floor(Math.random() * ((Constants.CANVAS_HEIGHT - 100) - 75) + 75);
    for (let j = 0; j < obstArray.length; j++ ) {
      status = true;
      dx = x - obstArray[j][0];
      dy = y - obstArray[j][1];
      distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < (Constants.OBS_RAD * 2) + (Constants.BALL_RADIUS * 6)) {
        status = false;
        break;
      }
    }
    if (status) {
      obstArray.push([x, y]);
      i++;
    }

  }
  obstNotBuilt = false;
}

function draw() {
  ctx.clearRect(0, 0, Constants.CANVAS_WIDTH, Constants.CANVAS_HEIGHT);
  drawHole();
  drawBall();
  console.log("drawing")
  if (obstNotBuilt) {
    buildObstacles(level);
  }
  drawObstacles();
  if (initialPower > .2) {
    xPos = xPos + (deltX * initialPower/25);
    yPos = yPos + (deltY * initialPower/25);
    initialPower *= .99;
    checkStatus();
  } else {
    let holeX = xPos - (Constants.CANVAS_WIDTH/2);
    let holeY = yPos - yHoleStart;
    let distance = Math.sqrt((holeX * holeX) + (holeY * holeY));

    if (distance < (Constants.HOLE_RADIUS - ballRadius/2)) {
      alertWinner();
    }
    if (strokes === 0) {
      endGame();
    }
    clearInterval(window.draw);
  }

}

function drawObstacles () {
  let x, y, i;
  for (i = 0; i < obstArray.length; i++) {
    x = obstArray[i][0];
    y = obstArray[i][1];
    ctx.beginPath();
    ctx.arc(x, y, Constants.OBS_RAD, 0, Math.PI*2);
    ctx.fillStyle = "#B7695C";
    ctx.fill();
    ctx.closePath
  }
}

function drawStats() {
  $("#level").empty();
  $("#throws").empty();
  $("#turns").empty();
  $("#level").append(`level: ${level}`);
  $("#throws").append(`throws: ${strokes}`);
  $("#turns").append(`turns: ${remainingTurns}`);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(xPos, yPos, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = "#06425C";
  ctx.fill();
  ctx.closePath();
  // setDirection();
  // setInitialSpeed();
};

function checkStatus() {
  if ((xPos - ballRadius) < 0) {
    endGame();
  }

  if ((xPos + ballRadius) > Constants.CANVAS_WIDTH) {
    endGame();
  }

  if ((yPos + ballRadius) > Constants.CANVAS_HEIGHT) {
    endGame();
  }

  for (let i = 0; i < obstArray.length; i++ ) {
    var circle1 = {radius: Constants.OBS_RAD, x: obstArray[i][0], y: obstArray[i][1]};
    var circle2 = {radius: ballRadius, x: xPos, y: yPos};

    var dx = circle1.x - circle2.x;
    var dy = circle1.y - circle2.y;
    var distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < circle1.radius + circle2.radius) {
        endGame();
    }
  }
}


function drawScore () {
  ctx.font = "20px Georgia";
  ctx.fillText(`strokes: ${strokes}`, Constants.CANVAS_WIDTH - 100, 30);
}


function drawHole() {
  ctx.beginPath();
  ctx.arc(Constants.CANVAS_WIDTH/2, yHoleStart, holeRadius, 0, Math.PI*2);

  ctx.fillStyle = "#F2F2F2";
  // ctx.lineWidth = 5;
  ctx.fill();
}

function drawHitDetails(xPos, yPos, xEnd, yEnd) {
  // if (xEnd === undefined || yEnd === undefined) {
  //   xEnd = xPos;
  //   yEnd = yPos;
  // }
  ctxPower.clearRect(0, 0, Constants.CP_WIDTH, Constants.CP_HEIGHT);
  ctxAim.clearRect(0, 0, Constants.CA_WIDTH, Constants.CA_HEIGHT);
  let xDif = (xEnd > xPos) ? (xEnd - xPos) : (xPos - xEnd);
  let yDif = (yEnd > yPos) ? (yEnd - yPos) : (yPos - yEnd);
  let pyth = (xDif * xDif) + (yDif * yDif);
  let tot = Math.floor(Math.sqrt(pyth));

  masterPower = tot;

  let startRad = getRad(xPos, yPos, xEnd, yEnd);
  // console.log(startRad);

  ctxPower.beginPath();
  ctxPower.rect(0, 0, Constants.CP_WIDTH, (tot * 2));
  ctxPower.fillStyle = "#814374";
  ctxPower.fill();
  ctxPower.closePath();

  ctxAim.beginPath();
  ctxAim.arc((Constants.CA_WIDTH/2), (Constants.CA_HEIGHT/2), Math.floor(Constants.CA_WIDTH/3), startRad - (Constants.ARC_CONST/2), (startRad + Constants.ARC_CONST));
  ctxAim.lineWidth = 15;
  ctxAim.strokeStyle = "#814374";
  ctxAim.stroke();
}

function getRad(xPos, yPos, xEnd, yEnd) {
  let slope, begin;
  let xVal = xEnd - xPos;
  let yVal = yPos - yEnd;
  let xDif = Math.abs(xEnd - xPos);
  let yDif = Math.abs(yEnd - yPos);
  let slopeConst = (yDif/(xDif + .001));
  // console.log(slopeConst)
  if (slopeConst <= 1) {
    slope = (1.570796 * slopeConst) / 2;
    begin = 0;
  } else {
    slope = 1.570796 - (xDif/yDif);
    begin = 1;
  }
  // console.log(`slope start=${slope}`);

  if ((xVal > 0) && (yVal > 0)) {
    slope = 3.141592 - slope;
    // console.log(`slope=${slope}`)
    // console.log(`1`)
  }
  if ((xVal <= 0) && (yVal >= 0)) {
    slope = 0 + slope;
    // console.log(`slope=${slope}`)
    // console.log(`2`)
  }
  if ((xVal <= 0) && (yVal <= 0)) {
    slope = 6.2831853 - slope;
    // console.log(`slope=${slope}`)
    // console.log(`3`)
  }
  if ((xVal > 0) && (yVal < 0)) {
    slope = 3.141592 + slope;
    // console.log(`slope=${slope}`)
    // console.log(`4`)
  }
  masterRadians = slope;
  return slope;
}

function alertWinner() {
  xPos = Constants.CANVAS_WIDTH/2;
  yPos = 15 + ballRadius;
  obstNotBuilt = true;
  obstArray = [];

  level ++;
  remainingTurns = remainingTurns + strokes
  strokes = 3;
  $("#feedback-banner").empty();
  $("#feedback-banner").removeClass("red");
  $("#feedback-banner").append("<h1>Score!</h1>");
  $("#feedback-banner").addClass("green");
  showFeedback(1000);
  drawStats();
  draw();
}

function endGame() {
  xPos = Constants.CANVAS_WIDTH/2;
  yPos = 15 + ballRadius;
  obstNotBuilt = true;
  obstArray = [];
  strokes = 3;
  initialPower = 0;
  remainingTurns --;
  drawStats();
  draw();
  if (remainingTurns < 1) {
    $("#feedback-banner").empty();
    $("#feedback-banner").removeClass("green");
    $("#feedback-banner").append("<h1>Game Over</h1>");
    $("#feedback-banner").addClass("red");
    showFeedback(2000);
    playGame();
  } else {
    $("#feedback-banner").empty();
    $("#feedback-banner").removeClass("green");
    $("#feedback-banner").append("<h1>Miss</h1>");
    $("#feedback-banner").addClass("red");
    showFeedback(1000);
  }
}

  // Initialize Slidebars
  let controller = new slidebars();
  controller.init();
  $( "#about" ).on( 'click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    clearInterval(window.draw);
    clearItems();
    clearClass(e);
    $("#score-stats").addClass("hidden");
    $(e.target).toggleClass('clicked');
    controller.open( 'id-1' );
  } );

  $("#close").on('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    clearItems();
    $("#about").toggleClass('clicked')
    controller.close( 'id-1');
  });

  $( "#instructions" ).on( 'click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      clearClass(e);
      $(e.target).toggleClass('clicked');
      controller.toggle( 'id-2' );
    } );

  $("#close-instructions").on( 'click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    controller.toggle( 'id-2');
    $("#instructions").toggleClass('clicked');
  });

  function showFeedback (speed) {
    controller.toggle('id-4');
    setTimeout(function() {
      controller.toggle('id-4')
    }, speed);
  }

  $( "#play" ).on( 'click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    clearClass(e);
    $(e.target).addClass('clicked');
    $("#score-stats").removeClass('hidden');
    playGame();
  } );

  function clearClass(e) {
    $(e.target).siblings().removeClass('clicked');
  }


// ( function ( $ ) {
//   // Initialize Slidebars
//   var controller1 = new slidebars();
//   controller1.init();
//
//   $( "#instructions" ).on( 'click', function (e) {
//     e.preventDefault();
//     e.stopPropagation();
//     controller1.open( 'id-2' );
//   } );
//
//   $("#close-sidebar2").on('click', function (e) {
//     e.preventDefault();
//     e.stopPropagation();
//     controller1.close( 'id-2');
//   });
//
// } ) ( jQuery );

function clearItems () {
  $("#disk").children("p").remove();
  $("#target").children("p").remove();
  $("#obstacle").children("p").remove();
  $("#aim-meter").children("p").remove();
  $("#power-meter").children("p").remove();
  ctx.clearRect(0, 0, Constants.CANVAS_WIDTH, Constants.CANVAS_HEIGHT);
  ctxAim.clearRect(0, 0, Constants.CA_WIDTH, Constants.CA_HEIGHT);
  ctxPower.clearRect(0, 0, Constants.CP_WIDTH, Constants.CP_HEIGHT);
}



$("#disk").on('click', function (e) {
  e.preventDefault();
  e.stopPropagation();
  clearItems();
    $("<p>The disk is what you throw towards the target by holding the mouse button down then dragging your mouse back to determine power and speed. Release the mouse button to send your disk across the board.</p>").appendTo("#disk");
    drawBall();
    diskClick = true;
})

$("#target").on('click', function (e) {
  e.preventDefault();
  e.stopPropagation();
  clearItems();
  $("<p>To advance a round, have your disk come to rest within the target area (over half the disk must be inside)</p>").appendTo("#target");
  drawHole();
})

$("#obstacle").on('click', function (e) {
  e.preventDefault();
  e.stopPropagation();
  clearItems();
  $("<p>Your disk cannot touch obstacles or you will lose a turn.</p>").appendTo("#obstacle");
  obstArray = [[Constants.CANVAS_WIDTH/2, Constants.CANVAS_HEIGHT/2]];
  drawObstacles();
})

$("#aim-meter").on('click', function (e) {
  e.preventDefault();
  e.stopPropagation();
  clearItems();
  $("<p>The aim meter shows you the direction your disk is currently aimed</p>").appendTo("#aim-meter");
    ctxAim.beginPath();
    ctxAim.arc((Constants.CA_WIDTH/2), (Constants.CA_HEIGHT/2), Math.floor(Constants.CA_WIDTH/3), 2.5 - (Constants.ARC_CONST/2), (2.5 + Constants.ARC_CONST));
    ctxAim.lineWidth = 15;
    ctxAim.strokeStyle = "#814374";
    ctxAim.stroke();
})

$("#power-meter").on('click', function (e) {
  e.preventDefault();
  e.stopPropagation();
  clearItems();
    $("<p class='comp-class'>The power meter shows you the speed your disk is powered</p>").appendTo("#power-meter");

    ctxPower.beginPath();
    ctxPower.rect(0, 0, Constants.CP_WIDTH, 75);
    ctxPower.fillStyle = "#814374";
    ctxPower.fill();
    ctxPower.closePath();
})



function playGame () {
  level = 1;
  remainingTurns = 3;
  strokes = 3;
  xPos = Constants.CANVAS_WIDTH/2;
  yPos = 15 + ballRadius;
  initialPower = 0;
  deltX = 0;
  deltY = 0;
  onSwing = false;
  obstNotBuilt = true
  obstArray = [];

  drawStats();
  draw();
}
// (Constants.ARC_CONST)/2
