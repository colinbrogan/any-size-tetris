var resolutionX = 40;
var resolutionY = 6;
var tileSize = 20;
var fps = 1;
var $grid = $('#scaling-grid-tetris');

var colin_babies = [
  [ 
    "XXXX",
  ],
  [
    "XXX",
    "X  ",
  ],
  [
    "XXX",
    "  X",
  ],
  [
    "XXX",
    " X ",
  ],
  [
    "XX",
    "XX",
  ],
];

var lilly_is_pregnant = true;
var freeze_all = false;

var current_shape = null;
var current_shape_scan_index = 0;
var feedMoveOffset = 0;

var shapeDelay = 6;
var frameCounter = 0;
var landed = false;
function buildScreen() {
    $grid.each(function() {
      for(var i = 0; i < resolutionX*resolutionY; i++) {
        var x = i % resolutionX + 1;
        var invertedY = Math.floor(i / resolutionX) + 1;
        var y = Math.abs(invertedY - resolutionY)+1;
        var $tile = $('<div/>')
          .addClass("tile")
          .attr("id","x"+x+"-"+"y"+y)
          .css("width",tileSize+"px")
          .css("height",tileSize+"px");
        $(this).append($tile);
      }
    }).css("width",resolutionX*tileSize);
}

function gameOver() {
  $(".tile.plat-shade").removeClass("plat-shade");
  $(".tile.shape-shade").removeClass("shape-shade");
  $(".tile.plat-remove").removeClass("plat-remove");
  $grid.addClass("game-over");
  clearInterval(frameEvent);
}

var frameEvent = function() {
  // physics of colin_babies 
  moveLeft();

  // clear fullRows
  var clearedRows = {};
  $('.plat-remove').each(function() {
    $(this).removeClass("plat-remove");
    var coordinates = $(this).attr("id").split("-");
    var x = coordinates[0].slice(1);
    var y = coordinates[1].slice(1);
    if(!clearedRows.hasOwnProperty(x)) {
      clearedRows[x] = true;
    } else {
      clearedRows[x] = true;
    }

  });  
  for (var clearedRow in clearedRows) {
    for(var scanx = clearedRow; scanx <= resolutionX; scanx++) {
      for(var scany = 1; scany <= resolutionY; scany++) {
        var $thisCell = $(makeCoordinates(scanx,scany));
        var $priorCell = $(makeCoordinates(Number(scanx) - 1,scany));
        if( $thisCell.hasClass("plat-shade") ) {
          $thisCell.removeClass("plat-shade");
          $priorCell.addClass("plat-shade");
        }
      }
    }
  }

  var rowFilledTo = {};
  $('.plat-shade').each(function() {
    var coordinates = $(this).attr("id").split("-");
    var x = coordinates[0].slice(1);
    var y = coordinates[1].slice(1);
    if(!rowFilledTo.hasOwnProperty(x)) {
      rowFilledTo[x] = 1;
    } else {
      rowFilledTo[x]++;
    }
  });
  for(var row in rowFilledTo) {
    if(rowFilledTo[row] == resolutionY) {
      for(var y = 1; y <= resolutionY; y++) {
        var x = row;
        $(makeCoordinates(x,y)).addClass("plat-remove");
        $(makeCoordinates(x,y)).removeClass("plat-shade");
      }
    }
  }



  // Feed colin_babies into grid
  if(frameCounter < 1 || landed == true || lilly_is_pregnant) {
//    var randy = Math.ceil(Math.random()*(resolutionY - (current_shape.length - 1)));
    var randy = resolutionY;
    if(current_shape_scan_index == 0) {
      current_shape = colin_babies[Math.floor(Math.random()*colin_babies.length)];
      console.log(current_shape);
    }
    var baby_length = 0;
    for(var column = 0; column < current_shape.length; column++) {
      var row = current_shape[column];
      if(row.length > baby_length) {
        baby_length = row.length;
      }
      if(row.charAt(current_shape_scan_index) == "X") {
        console.log(makeCoordinates(resolutionX,randy - column))
        $(makeCoordinates(resolutionX,randy - column)).addClass("shape-shade");
      }
    }
    var priorcell = makeCoordinates(resolutionX-1,randy);
    if($grid.hasClass("game-over")) {
      $grid.removeClass("game-over");
    }
    if( $(priorcell).hasClass("plat-shade") ) {
      gameOver();
    } else {
      landed = false;
      current_shape_scan_index++;

      if(current_shape_scan_index == baby_length) {
        current_shape_scan_index = 0;
        lilly_is_pregnant = false;
      }
    }
  }
  
  frameCounter++;
}

var moveLeft = function() {
  $('.shape-shade').each(function() {
    var coordinates = $(this).attr("id").split("-");
    var x = coordinates[0].slice(1);
    var y = coordinates[1].slice(1);
    var newx = x - 1;
    var newcoordinates = "#x"+newx+"-"+"y"+y;
    var $priorcell = $(newcoordinates);
    if(newx > 0 && !$priorcell.hasClass("plat-shade") && !freeze_all) {
      $(this).removeClass("shape-shade");
      $priorcell.addClass("shape-shade");
      landed = false;
    } else {
      freeze_all = true;
      $('.shape-shade').each(function() {
        $(this).removeClass("shape-shade");
        $(this).addClass("plat-shade");
      });
      landed = true;
      lilly_is_pregnant = true;
    }
  });
  freeze_all = false;
}

var moveUp = function() {
  $('.shape-shade').each(function() {
    var coordinates = $(this).attr("id").split("-");
    var x = coordinates[0].slice(1);
    var y = coordinates[1].slice(1);
    var newy = y;
    if(y < resolutionY) {
      newy = Number(y) + 1;
    }
    var newcoordinates = "#x"+x+"-"+"y"+newy;
    if(!$(newcoordinates).hasClass("plat-shade")) {
      $(this).removeClass("shape-shade");
      $(newcoordinates).addClass("shape-shade");
    }

  });
}

var moveDown = function() {
  $('.shape-shade').each(function() {
    var coordinates = $(this).attr("id").split("-");
    var x = coordinates[0].slice(1);
    var y = coordinates[1].slice(1);
    var newy = y;
    if(y > 1) {
      newy = Number(y) - 1;
    }
    var newcoordinates = "#x"+x+"-"+"y"+newy;
    if(!$(newcoordinates).hasClass("plat-shade")) {
      $(this).removeClass("shape-shade");
      $(newcoordinates).addClass("shape-shade");
    }

  });
}

var moveRight = function() {

}

$(document).ready(function() {
  buildScreen();
  frameEvent();
  setInterval(frameEvent, 1000/fps);
  $(window).on("keydown",function(event) { 
    if(event.keyCode == 37) {
      frameEvent();
    } else if (event.keyCode == 38) {
      moveUp();
    } else if (event.keyCode == 40) {
      moveDown();
    }
  });
});

// utility

function makeCoordinates(x,y) {
  return "#x"+x+"-y"+y;
}