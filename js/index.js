var resolutionX = 29;
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
    // Reset landed to false when creating new shape
    this.landed = false;

    // clear previous shape coordinates
    this.tiles = [];
    var randomIndex = Math.floor(Math.random()*Shapes.length);


    this.currentShapeIndex = randomIndex;
    var newShape = Shapes[randomIndex];

    // Eventually make this newShape.length > resolutionY
    var randomYOffset = 0;

    for(var rowIndex = 0; rowIndex < newShape.length; rowIndex++) {
      var row = newShape[rowIndex];
      for(var columnIndex = 0; columnIndex < row.length; columnIndex++) {
        if(row.charAt(columnIndex) == "X") {
          var zeroBaseX = columnIndex;
          var zeroBaseY = rowIndex;
          var offScreenX = zeroBaseX + resolutionX + 1;
          var randomStartY = resolutionY - zeroBaseY + randomYOffset;
          this.tiles.push([offScreenX,randomStartY]);
        }
      }
    }
    console.log("Shapes[randomIndex]");
    console.log(newShape);
    console.log("Shape.tiles:");
    console.log(this.tiles);
  },
  moveLeft: function() {
    console.log("Shape.moveLeft()");
    if(Platform.getsLandedOnBy(this.tiles)) {
      Platform.freezeShape(this);
    } else {
      var tempStoreTiles = this.tiles;
      this.tiles = [];
      for(tile in tempStoreTiles) {
        var tileX = tile[0];
        var tileY = tile[1];
        this.tiles.push([tileX - 1,tileY]);
      }
      console.log("new this.tiles:");
      console.log(this.tiles);
    }

  },
  moveUp: function() {
    console.log("Shape.moveUp()");
  },
  moveDown: function() {
    console.log("Shape.moveDown()");
  },
  writeShades: function() {
    // clear prior shape shades to prepare for new shading
    $grid.find(".tile").removeClass("shape-shade");
    for(tile in this.tile) {
      var tileX = tile[0];
      var tileY = tile[1];
      $(makeCoordinates(tileX,tileY)).addClass("shape-shade");
    }
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
  getsLandedOnBy: function(tiles) {
    console.log("Platform.getsLandedOnBy");
    return false;
  },
  clearFullColumn: function() {
    console.log("Platform.clearFullColumn");
  },
  writeShades: function() {
    console.log("Platform.writeShades");
  },
}

var frameEvent = function() {
  if(Shape.landed) {
    Platform.freezeShape(Shape);
    Shape.generateAnew();
    Platform.writeShades();
  } else { 
    Shape.moveLeft();
  }
  Shape.writeShades();
}


$(document).ready(function() {
  buildScreen();
  Shape.generateAnew();
//  frameEvent();
//  setInterval(frameEvent, 1000/fps);
  $grid.unbind("keydown")
  $grid.on("keydown",function(event) { 
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