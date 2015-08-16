var resolutionX = 30;
var resolutionY = 6;
var tileSize = 30;
var fps = 3;
var $grid = $('#scaling-grid-tetris');
var shapes = [
    "xxxx",
    "xxx\
     x..",
    "xx\
     xx",
    ".xx\
     xx.",
    ".x.\
     xxx"
];
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
  $(".shape-shade").each(function() {
    $(this).removeClass("shape-shade");
    $grid.addClass("game-over");
    clearInterval(frameEvent);
  })
}

var frameEvent = function() {
  // physics of shapes 
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
  for (var clearedRow in clearedRows)
    for(var scanx = clearedRow; scanx <= resolutionX; scanx++) {
      for(var scany = 1; scany <= resolutionY; scany++) {
        var $thisCell = $(makeCoordinates(scanx,scany));
        var $priorCell = $(makeCoordinates(Number(scanx) - 1,scany));
        if( $thisCell.hasClass("plat-shade") ) {
          $thisCell.removeClass("plat-shade");
          console.log("$thisCell");
          console.log($thisCell);
          $priorCell.addClass("plat-shade");
          console.log("$priorCell");
          console.log($priorCell);
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



  // Feed Shapes into grid
  if(frameCounter == 1 || landed == true) {
    var randy = Math.ceil(Math.random()*resolutionY);
    var priorcell = '#x'+(resolutionX-1)+'-'+'y'+randy;
    if( $(priorcell).hasClass("plat-shade")) {
      gameOver();
    } else {
      $('#x'+resolutionX+'-'+'y'+randy).addClass("shape-shade");
      landed = false;
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
    if(newx > 0 && !$priorcell.hasClass("plat-shade")) {
      $(this).removeClass("shape-shade");
      $priorcell.addClass("shape-shade");
      landed = false;
    } else {
      $(this).removeClass("shape-shade");
      $(this).addClass("plat-shade");
      landed = true;
    }
  });
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
    console.log(coordinates);
    console.log(newcoordinates);
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
    console.log(coordinates);
    console.log(newcoordinates);
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
      moveLeft();
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