var resolutionX = 40;
var resolutionY = 6;
var tileSize = 20;
var fps = 1;
var $grid = $('#scaling-grid-tetris');

var platClass = "plat-shade";
var shapeClass = "shape-shade";
var platClearClass = "plat-remove";

var Shapes = [
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

var Shape = {
  landed: false,
  currentShapeIndex: 0,
  tiles: [

  ],
  generateAnew: function() {
    // clear previous shape coordinates
    this.tiles = [];
    var randomIndex = Math.floor(Math.random(Shapes.length));
    this.currentShapeIndex = randomIndex;
    var newShape = Shapes[randomIndex];
    for(var rowIndex = 0; rowIndex < newShape.length; rowIndex++) {
      var row = newShape[rowIndex];
      for(var columnIndex = 0; columnIndex < row.length; columnIndex++) {
        if(row.charAt(columnIndex) == "X") {
          this.tiles.append([columnIndex,rowIndex]);
        }
      }
    }
    console.log("Shape.tiles:");
    console.log(this.tiles);
  },
  moveleft: function() {
    console.log("Shape.moveLeft()");
  },
  moveUp: function() {
    console.log("Shape.moveUp()");
  },
  moveDown: function() {
    console.log("Shape.moveDown()");
  },
  writeShades: function($grid) {

  }
}

var Platform = {
  tiles: [
  ],
  freezeShape: function(Shape) {
    console.log("Platform.freezeShape");
  },
  checkOverflow: function() {
    console.log("Platform.checkOverflow");
  },
  checkLanded: function(Shape) {
    console.log("Platform.checkLanded");
  },
  clearFullColumn: function() {
    console.log("Platform.clearFullColumn");
  },
  writeShades: function($grid) {
    console.log("Platform.writeShades");
  },
}

var frameEvent = function() {
  if(Shape.landed) {
    Platform.freezeShape(Shape);
    Shape.generateAnew();
  } else { 
    Shape.moveLeft();
  }

}


$(document).ready(function() {
  buildScreen();
  Shape.generateAnew();
  frameEvent();
  setInterval(frameEvent, 1000/fps);
  $(grid).unbind("keydown")
  $(grid).on("keydown",function(event) { 
    if(event.keyCode == 37) {
      frameEvent();
    } else if (event.keyCode == 38) {
      Shape.moveUp();
    } else if (event.keyCode == 40) {
      Shape.moveDown();
    }
  });
});

// utility

function makeCoordinates(x,y) {
  return "#x"+x+"-y"+y;
}