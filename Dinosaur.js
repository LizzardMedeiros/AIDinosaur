const robot = require("robotjs");

let Dinosaur = {

  eye_height : 55,
  position: {x:165, y:475},
  dino_color_night : "acacac",
  screenSize : robot.getScreenSize(),
  steps : 32,

  getObstacleDistance : function () {
    let grid = Math.floor(this.screenSize.width / this.steps) - Math.floor(this.position.x / this.steps);
    for(let i=1; i<grid; i++){
      let xx = (i * this.steps) + this.position.x;
      let yy = this.position.y + this.eye_height;
      let color = robot.getPixelColor(xx, yy);

      if(color === this.dino_color_night) return xx;
    }
    return -1;
  },
  move : function(type){
    switch(type){
      case 0: //jump or start
        robot.keyTap("space");
        break;
      case 1: //Crouch
        robot.keyTap("down");
    }
  },
  checkGameOver : function () {
    return robot.getPixelColor(800, 465) === this.dino_color_night;
  }
}

module.exports = Dinosaur;