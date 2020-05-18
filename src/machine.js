const robot = require("robotjs");
const config = require("../configs/config.json")

module.exports = {

  screenSize : robot.getScreenSize(),

  getObstacleDistance : function () {
    let grid = Math.floor(this.screenSize.width / config.steps) - Math.floor(config.dino_position.x / config.steps);
    for(let i=1; i<grid; i++){
      let xx = (i * config.steps) + config.dino_position.x;
      let yy = config.dino_position.y + config.cactus_height;
      let color = robot.getPixelColor(xx, yy);

      if(color === config.dino_color_day) return xx;
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
    return robot.getPixelColor(740, 340) === config.dino_color_day;
  },

  checkGameScreen : function () {
    return (robot.getPixelColor(0, 120) === "202124")
  }
}