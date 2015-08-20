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

/*******    SHAPE OBJECT     ********/
/*******                     ********/
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

    // Convert Shape Strings into x,y coordinates for this.tiles
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

  },
  moveLeft: function() {
    console.log("Shape.moveLeft()");
    if(Platform.getsLandedOnBy(this.tiles)) {
      console.log("this.landed set to true");
      this.landed = true;
      return false;
    } else {
      var tempStoreTiles = this.tiles.splice(0);
      this.tiles = [];
      for(tile in tempStoreTiles) {
        var tileX = tempStoreTiles[tile][0];
        var tileY = tempStoreTiles[tile][1];
        Shape.tiles.push([tileX - 1,tileY]);
      }
      return true;
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
    console.log("Shape.writeShades")
    $grid.find(".tile").removeClass("shape-shade");
    for(tile in this.tiles) {
      var tileX = this.tiles[tile][0];
      var tileY = this.tiles[tile][1];
      console.log($(makeCoordinates(tileX,tileY)));
      $(makeCoordinates(tileX,tileY)).addClass("shape-shade");
    }
  }
}

var Platform = {
  tiles: [
  ],
  freezeShape: function(shapeInstance) {
    console.log("Platform.freezeShape");
    for(var stI in shapeInstance.tiles) {
      var shapeTileX = shapeInstance.tiles[stI][0];
      var shapeTileY = shapeInstance.tiles[stI][1];
      this.tiles.push([shapeTileX,shapeTileY]);
    }
    console.log("new Platform tiles");
    console.log(this.tiles);
  },
  checkOverflow: function() {
    console.log("Platform.checkOverflow");
  },
  getsLandedOnBy: function(shapeTiles) {
    console.log("Platform.getsLandedOnBy");
    for(var stI in shapeTiles) {
      var shapeTileX = shapeTiles[stI][0];
      var shapeTileY = shapeTiles[stI][1];
      if(shapeTileX == 1) {
        return true;
      }
      for(var ptI in this.tiles) {
        var platTileX = this.tiles[ptI][0];
        var platTileY = this.tiles[ptI][1];
        if(shapeTileX - platTileX <= 1 && shapeTileY == platTileY) {
          alert("this happened");
          return true;
        }
      }
    }
    return false;
  },
  clearFullColumn: function() {
    console.log("Platform.clearFullColumn");
  },
  writeShades: function() {
    console.log("Platform.writeShades");
    $grid.find(".tile").removeClass("plat-shade");
    $grid.find(".tile").removeClass("shape-shade");
    for(tile in this.tiles) {
      var tileX = this.tiles[tile][0];
      console.log(tileX);
      var tileY = this.tiles[tile][1];
      console.log(tileY);
      console.log($(makeCoordinates(tileX,tileY)));
      $(makeCoordinates(tileX,tileY)).addClass("plat-shade");
    }
  },
}
var firedOnce = false;

var frameEvent = function() {
  if(Shape.moveLeft()) {
    Shape.writeShades();
  } else if(!firedOnce) {
    firedOnce = true;
    Platform.freezeShape(Shape);
    Shape.generateAnew();
    Platform.writeShades();
  }
}


$(document).ready(function() {
  buildScreen();
  Shape.generateAnew();
  frameEvent();
  setInterval(frameEvent, 1000/fps);
  $(window).unbind("keydown");
  $(window).on("keydown",function(event) { 
    if(event.keyCode == 37) {
      console.log("hit left key");
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