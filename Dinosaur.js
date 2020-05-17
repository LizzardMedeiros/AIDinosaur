const robot = require("robotjs");

module.exports = {

  eye_height : 65,
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
      case "jump":
        robot.keyToggle("down", "up");
        robot.keyToggle("space", "down");
        //robot.keyTap("space");
        break;
      case "crouch":
        robot.keyToggle("space", "up");
        robot.keyToggle("down", "down");
        //robot.keyTap("down");
        break;
      case "start":
        robot.keyTap("space");
        break;
      default:
        robot.keyToggle("space", "up");
        robot.keyToggle("down", "up");
        break;
    }
  },

  checkGameOver : function () {
    return robot.getPixelColor(740, 340) === this.dino_color_night;
  },

  checkGameScreen : function () {
    return (robot.getPixelColor(0, 120) === "202124")
  }
}