/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const Constants = __webpack_require__(1);
	const slidebars = __webpack_require__(3)
	
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
	
	  console.log("miss");
	};
	
	function strikeBall(xEnd, yEnd) {
	  console.log("striking ball");
	  console.log(ballX);
	  console.log(ballY);
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
	    drawStats();
	  } else {
	    initialPower = tot;
	    strokes --;
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
	    x = Math.floor(Math.random() * ((Constants.CANVAS_WIDTH - (Constants.OBS_RAD)) - (Constants.OBS_RAD)) + (Constants.OBS_RAD));
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
	  if (obstNotBuilt) {
	    buildObstacles(level);
	  }
	  drawObstacles();
	  if (initialPower > .4) {
	    xPos = xPos + (deltX * initialPower/10);
	    yPos = yPos + (deltY * initialPower/10);
	    initialPower *= .97;
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
	  $("#remaining-throws").empty();
	  $("#remaining-turns").empty();
	  $(`<p>Level: ${level}</p>`).appendTo("#level");
	  $(`<p>Remaining Throws: ${strokes}</p>`).appendTo("#remaining-throws");
	  $(`<p>Remaining Turns: ${remainingTurns}</p>`).appendTo("#remaining-turns");
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
	  if (xPos < 0) {
	    endGame();
	  }
	
	  if (xPos > Constants.CANVAS_WIDTH) {
	    endGame();
	  }
	
	  if (yPos > Constants.CANVAS_HEIGHT) {
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
	  let slopeConst = (yDif/(xDif + .001))
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
	  return slope
	}
	
	function alertWinner() {
	  xPos = Constants.CANVAS_WIDTH/2;
	  yPos = 15 + ballRadius;
	  obstNotBuilt = true;
	  obstArray = [];
	  strokes = 3;
	  level ++;
	  drawStats();
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
	  if (remainingTurns < 1) {
	    playGame();
	  }
	}
	
	function resetBoard () {
	  
	}
	
	( function ( $ ) {
	  // Initialize Slidebars
	  var controller = new slidebars();
	  controller.init();
	  $( "#about" ).on( 'click', function (e) {
	    e.preventDefault();
	    e.stopPropagation();
	    resetBoard();
	    controller.open( 'id-1' );
	  } );
	
	  $("#close").on('click', function (e) {
	    e.preventDefault();
	    e.stopPropagation();
	    controller.close( 'id-1');
	  });
	
	  $( "#instructions" ).on( 'click', function (e) {
	      e.preventDefault();
	      e.stopPropagation();
	      controller.toggle( 'id-2' );
	    } );
	
	  $( "#play" ).on( 'click', function (e) {
	    e.preventDefault();
	    e.stopPropagation();
	    controller.open( 'id-3');
	    playGame();
	  } );
	
	
	} ) ( jQuery );
	
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
	
	let diskClick = false;
	$("#disk").on('click', function (e) {
	  e.preventDefault();
	  e.stopPropagation();
	  if (diskClick === false) {
	    $("<p>The disk is what you throw towards the target by clicking on it and then dragging your mouse back to determine power and speed.</p>").appendTo("#disk");
	    ctx.clearRect(0, 0, Constants.CANVAS_WIDTH, Constants.CANVAS_HEIGHT);
	    drawBall();
	    diskClick = true;
	  } else {
	    $("#disk").children("p").remove();
	    ctx.clearRect(0, 0, Constants.CANVAS_WIDTH, Constants.CANVAS_HEIGHT);
	    diskClick= false;
	  }
	})
	
	let targetClick = false;
	$("#target").on('click', function (e) {
	  e.preventDefault();
	  e.stopPropagation();
	  if (targetClick === false) {
	    $("<p>To advance a round, have your disk rest completely within the target area</p>").appendTo("#target");
	    ctx.clearRect(0, 0, Constants.CANVAS_WIDTH, Constants.CANVAS_HEIGHT);
	    drawHole();
	    targetClick = true;
	  } else {
	    $("#target").children("p").remove();
	    ctx.clearRect(0, 0, Constants.CANVAS_WIDTH, Constants.CANVAS_HEIGHT);
	    targetClick = false;
	  }
	})
	
	let obstacleClick = false;
	$("#obstacle").on('click', function (e) {
	  e.preventDefault();
	  e.stopPropagation();
	  if (obstacleClick === false) {
	    $("<p>Your disk cannot touch obstacles, or you will lose a turn.</p>").appendTo("#obstacle");
	    ctx.clearRect(0, 0, Constants.CANVAS_WIDTH, Constants.CANVAS_HEIGHT);
	    obstArray = [[Constants.CANVAS_WIDTH/2, Constants.CANVAS_HEIGHT/2]];
	    drawObstacles();
	    obstacleClick = true;
	  } else {
	    $("#obstacle").children("p").remove();
	    ctx.clearRect(0, 0, Constants.CANVAS_WIDTH, Constants.CANVAS_HEIGHT);
	    obstacleClick = false;
	  }
	})
	
	let aimMeterClick = false;
	$("#aim-meter").on('click', function (e) {
	  e.preventDefault();
	  e.stopPropagation();
	  if (aimMeterClick === false) {
	    $("<p>The aim meter shows you the direction your disk is aimed</p>").appendTo("#aim-meter");
	
	    ctxAim.beginPath();
	    ctxAim.arc((Constants.CA_WIDTH/2), (Constants.CA_HEIGHT/2), Math.floor(Constants.CA_WIDTH/3), 2.5 - (Constants.ARC_CONST/2), (2.5 + Constants.ARC_CONST));
	    ctxAim.lineWidth = 15;
	    ctxAim.strokeStyle = "#814374";
	    ctxAim.stroke();
	    aimMeterClick = true;
	  } else {
	    $("#aim-meter").children("p").remove();
	    aimMeterClick = false;
	    ctxAim.clearRect(0, 0, Constants.CA_WIDTH, Constants.CA_HEIGHT);
	  }
	})
	
	let powerMeterClick = false;
	$("#power-meter").on('click', function (e) {
	  e.preventDefault();
	  e.stopPropagation();
	  if (powerMeterClick === false) {
	    $("<p>The power meter shows you the direction your disk is powered</p>").appendTo("#power-meter");
	
	    ctxPower.beginPath();
	    ctxPower.rect(0, 0, Constants.CP_WIDTH, 75);
	    ctxPower.fillStyle = "#814374";
	    ctxPower.fill();
	    ctxPower.closePath();
	    powerMeterClick = true;
	  } else {
	    $("#power-meter").children("p").remove();
	    powerMeterClick = false;
	    ctxPower.clearRect(0, 0, Constants.CP_WIDTH, Constants.CP_HEIGHT);
	  }
	})
	
	
	
	function playGame () {
	  level = 1;
	  remainingTurns = 3;
	  strokes = 3;
	  drawStats();
	
	  setInterval(draw, 10);
	}
	// (Constants.ARC_CONST)/2


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = {
	  CANVAS_WIDTH: 600,
	  CANVAS_HEIGHT: 600,
	  BALL_RADIUS: 6,
	  HOLE_RADIUS: 16,
	  CP_WIDTH: 100,
	  CP_HEIGHT: 300,
	  CA_WIDTH: 150,
	  CA_HEIGHT: 150,
	  ARC_CONST: .5,
	  OBS_RAD: 30
	}


/***/ },
/* 2 */,
/* 3 */
/***/ function(module, exports) {

	/*!
	 * Slidebars - A jQuery Framework for Off-Canvas Menus and Sidebars
	 * Version: 2.0.2
	 * Url: http://www.adchsm.com/slidebars/
	 * Author: Adam Charles Smith
	 * Author url: http://www.adchsm.com/
	 * License: MIT
	 * License url: http://www.adchsm.com/slidebars/license/
	 */
	
	var slidebars = function () {
	
		/**
		 * Setup
		 */
	
		// Cache all canvas elements
		var canvas = $( '[canvas]' ),
	
		// Object of Slidebars
		offCanvas = {},
	
		// Variables, permitted sides and styles
		init = false,
		registered = false,
		sides = [ 'top', 'right', 'bottom', 'left' ],
		styles = [ 'reveal', 'push', 'overlay', 'shift' ],
	
		/**
		 * Get Animation Properties
		 */
	
		getAnimationProperties = function ( id ) {
			// Variables
			var elements = $(),
			amount = '0px, 0px',
			duration = parseFloat( offCanvas[ id ].element.css( 'transitionDuration' ), 10 ) * 1000;
	
			// Elements to animate
			if ( offCanvas[ id ].style === 'reveal' || offCanvas[ id ].style === 'push' || offCanvas[ id ].style === 'shift' ) {
				elements = elements.add( canvas );
			}
	
			if ( offCanvas[ id ].style === 'push' || offCanvas[ id ].style === 'overlay' || offCanvas[ id ].style === 'shift' ) {
				elements = elements.add( offCanvas[ id ].element );
			}
	
			// Amount to animate
			if ( offCanvas[ id ].active ) {
				if ( offCanvas[ id ].side === 'top' ) {
					amount = '0px, ' + offCanvas[ id ].element.css( 'height' );
				} else if ( offCanvas[ id ].side === 'right' ) {
					amount = '-' + offCanvas[ id ].element.css( 'width' ) + ', 0px';
				} else if ( offCanvas[ id ].side === 'bottom' ) {
					amount = '0px, -' + offCanvas[ id ].element.css( 'height' );
				} else if ( offCanvas[ id ].side === 'left' ) {
					amount = offCanvas[ id ].element.css( 'width' ) + ', 0px';
				}
			}
	
			// Return animation properties
			return { 'elements': elements, 'amount': amount, 'duration': duration };
		},
	
		/**
		 * Slidebars Registration
		 */
	
		registerSlidebar = function ( id, side, style, element ) {
			// Check if Slidebar is registered
			if ( isRegisteredSlidebar( id ) ) {
				throw "Error registering Slidebar, a Slidebar with id '" + id + "' already exists.";
			}
	
			// Register the Slidebar
			offCanvas[ id ] = {
				'id': id,
				'side': side,
				'style': style,
				'element': element,
				'active': false
			};
		},
	
		isRegisteredSlidebar = function ( id ) {
			// Return if Slidebar is registered
			if ( offCanvas.hasOwnProperty( id ) ) {
				return true;
			} else {
				return false;
			}
		};
	
		/**
		 * Initialization
		 */
	
		this.init = function ( callback ) {
			// Check if Slidebars has been initialized
			if ( init ) {
				throw "Slidebars has already been initialized.";
			}
	
			// Loop through and register Slidebars
			if ( ! registered ) {
				$( '[off-canvas]' ).each( function () {
					// Get Slidebar parameters
					var parameters = $( this ).attr( 'off-canvas' ).split( ' ', 3 );
	
					// Make sure a valid id, side and style are specified
					if ( ! parameters || ! parameters[ 0 ] || sides.indexOf( parameters[ 1 ] ) === -1 || styles.indexOf( parameters[ 2 ] ) === -1 ) {
						throw "Error registering Slidebar, please specifiy a valid id, side and style'.";
					}
	
					// Register Slidebar
					registerSlidebar( parameters[ 0 ], parameters[ 1 ], parameters[ 2 ], $( this ) );
				} );
	
				// Set registered variable
				registered = true;
			}
	
			// Set initialized variable
			init = true;
	
			// Set CSS
			this.css();
	
			// Trigger event
			$( events ).trigger( 'init' );
	
			// Run callback
			if ( typeof callback === 'function' ) {
				callback();
			}
		};
	
		this.exit = function ( callback ) {
			// Check if Slidebars has been initialized
			if ( ! init ) {
				throw "Slidebars hasn't been initialized.";
			}
	
			// Exit
			var exit = function () {
				// Set init variable
				init = false;
	
				// Trigger event
				$( events ).trigger( 'exit' );
	
				// Run callback
				if ( typeof callback === 'function' ) {
					callback();
				}
			};
	
			// Call exit, close open Slidebar if active
			if ( this.getActiveSlidebar() ) {
				this.close( exit );
			} else {
				exit();
			}
		};
	
		/**
		 * CSS
		 */
	
		this.css = function ( callback ) {
			// Check if Slidebars has been initialized
			if ( ! init ) {
				throw "Slidebars hasn't been initialized.";
			}
	
			// Loop through Slidebars to set negative margins
			for ( var id in offCanvas ) {
				// Check if Slidebar is registered
				if ( isRegisteredSlidebar( id ) ) {
					// Calculate offset
					var offset;
	
					if ( offCanvas[ id ].side === 'top' || offCanvas[ id ].side === 'bottom' ) {
						offset = offCanvas[ id ].element.css( 'height' );
					} else {
						offset = offCanvas[ id ].element.css( 'width' );
					}
	
					// Apply negative margins
					if ( offCanvas[ id ].style === 'push' || offCanvas[ id ].style === 'overlay' || offCanvas[ id ].style === 'shift' ) {
						offCanvas[ id ].element.css( 'margin-' + offCanvas[ id ].side, '-' + offset );
					}
				}
			}
	
			// Reposition open Slidebars
			if ( this.getActiveSlidebar() ) {
				this.open( this.getActiveSlidebar() );
			}
	
			// Trigger event
			$( events ).trigger( 'css' );
	
			// Run callback
			if ( typeof callback === 'function' ) {
				callback();
			}
		};
	
		/**
		 * Controls
		 */
	
		this.open = function ( id, callback ) {
			// Check if Slidebars has been initialized
			if ( ! init ) {
				throw "Slidebars hasn't been initialized.";
			}
	
			// Check if id wasn't passed or if Slidebar isn't registered
			if ( ! id || ! isRegisteredSlidebar( id ) ) {
				throw "Error opening Slidebar, there is no Slidebar with id '" + id + "'.";
			}
	
			// Open
			var open = function () {
				// Set active state to true
				offCanvas[ id ].active = true;
	
				// Display the Slidebar
				offCanvas[ id ].element.css( 'display', 'block' );
	
				// Trigger event
				$( events ).trigger( 'opening', [ offCanvas[ id ].id ] );
	
				// Get animation properties
				var animationProperties = getAnimationProperties( id );
	
				// Apply css
				animationProperties.elements.css( {
					'transition-duration': animationProperties.duration + 'ms',
					'transform': 'translate(' + animationProperties.amount + ')'
				} );
	
				// Transition completed
				setTimeout( function () {
					// Trigger event
					$( events ).trigger( 'opened', [ offCanvas[ id ].id ] );
	
					// Run callback
					if ( typeof callback === 'function' ) {
						callback();
					}
				}, animationProperties.duration );
			};
	
			// Call open, close open Slidebar if active
			if ( this.getActiveSlidebar() && this.getActiveSlidebar() !== id ) {
				this.close( open );
			} else {
				open();
			}
		};
	
		this.close = function ( id, callback ) {
			// Shift callback arguments
			if ( typeof id === 'function' ) {
				callback = id;
				id = null;
			}
	
			// Check if Slidebars has been initialized
			if ( ! init ) {
				throw "Slidebars hasn't been initialized.";
			}
	
			// Check if id was passed but isn't a registered Slidebar
			if ( id && ! isRegisteredSlidebar( id ) ) {
				throw "Error closing Slidebar, there is no Slidebar with id '" + id + "'.";
			}
	
			// If no id was passed, get the active Slidebar
			if ( ! id ) {
				id = this.getActiveSlidebar();
			}
	
			// Close a Slidebar
			if ( id && offCanvas[ id ].active ) {
				// Set active state to false
				offCanvas[ id ].active = false;
	
				// Trigger event
				$( events ).trigger( 'closing', [ offCanvas[ id ].id ] );
	
				// Get animation properties
				var animationProperties = getAnimationProperties( id );
	
				// Apply css
				animationProperties.elements.css( 'transform', '' );
	
				// Transition completetion
				setTimeout( function () {
					// Remove transition duration
					animationProperties.elements.css( 'transition-duration', '' );
	
					// Hide the Slidebar
					offCanvas[ id ].element.css( 'display', '' );
	
					// Trigger event
					$( events ).trigger( 'closed', [ offCanvas[ id ].id ] );
	
					// Run callback
					if ( typeof callback === 'function' ) {
						callback();
					}
				}, animationProperties.duration );
			}
		};
	
		this.toggle = function ( id, callback ) {
			// Check if Slidebars has been initialized
			if ( ! init ) {
				throw "Slidebars hasn't been initialized.";
			}
	
			// Check if id wasn't passed or if Slidebar isn't registered
			if ( ! id || ! isRegisteredSlidebar( id ) ) {
				throw "Error toggling Slidebar, there is no Slidebar with id '" + id + "'.";
			}
	
			// Check Slidebar state
			if ( offCanvas[ id ].active ) {
				// It's open, close it
				this.close( id, function () {
					// Run callback
					if ( typeof callback === 'function' ) {
						callback();
					}
				} );
			} else {
				// It's closed, open it
				this.open( id, function () {
					// Run callback
					if ( typeof callback === 'function' ) {
						callback();
					}
				} );
			}
		};
	
		/**
		 * Active States
		 */
	
		this.isActive = function ( id ) {
			// Return init state
			return init;
		};
	
		this.isActiveSlidebar = function ( id ) {
			// Check if Slidebars has been initialized
			if ( ! init ) {
				throw "Slidebars hasn't been initialized.";
			}
	
			// Check if id wasn't passed
			if ( ! id ) {
				throw "You must provide a Slidebar id.";
			}
	
			// Check if Slidebar is registered
			if ( ! isRegisteredSlidebar( id ) ) {
				throw "Error retrieving Slidebar, there is no Slidebar with id '" + id + "'.";
			}
	
			// Return the active state
			return offCanvas[ id ].active;
		};
	
		this.getActiveSlidebar = function () {
			// Check if Slidebars has been initialized
			if ( ! init ) {
				throw "Slidebars hasn't been initialized.";
			}
	
			// Variable to return
			var active = false;
	
			// Loop through Slidebars
			for ( var id in offCanvas ) {
				// Check if Slidebar is registered
				if ( isRegisteredSlidebar( id ) ) {
					// Check if it's active
					if ( offCanvas[ id ].active ) {
						// Set the active id
						active = offCanvas[ id ].id;
						break;
					}
				}
			}
	
			// Return
			return active;
		};
	
		this.getSlidebars = function () {
			// Check if Slidebars has been initialized
			if ( ! init ) {
				throw "Slidebars hasn't been initialized.";
			}
	
			// Create an array for the Slidebars
			var slidebarsArray = [];
	
			// Loop through Slidebars
			for ( var id in offCanvas ) {
				// Check if Slidebar is registered
				if ( isRegisteredSlidebar( id ) ) {
					// Add Slidebar id to array
					slidebarsArray.push( offCanvas[ id ].id );
				}
			}
	
			// Return
			return slidebarsArray;
		};
	
		this.getSlidebar = function ( id ) {
			// Check if Slidebars has been initialized
			if ( ! init ) {
				throw "Slidebars hasn't been initialized.";
			}
	
			// Check if id wasn't passed
			if ( ! id ) {
				throw "You must pass a Slidebar id.";
			}
	
			// Check if Slidebar is registered
			if ( ! id || ! isRegisteredSlidebar( id ) ) {
				throw "Error retrieving Slidebar, there is no Slidebar with id '" + id + "'.";
			}
	
			// Return the Slidebar's properties
			return offCanvas[ id ];
		};
	
		/**
		 * Events
		 */
	
		this.events = {};
		var events = this.events;
	
		/**
		 * Resizes
		 */
	
		$( window ).on( 'resize', this.css.bind( this ) );
	};
	
	module.exports = slidebars;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map