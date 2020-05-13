const robot = require("robotjs");

//Configurations
let configs = {
  steps: 20,
  dino_color_night: "acacac",
  fps: 24
};

let loop = {};

//Resolução da tela
let screenSize = robot.getScreenSize();

//Game screen - x, y, width, height
let screenGame = robot.screen.capture(0, 100, screenSize.width, 500);

//Check if screen is correct
let is_dinosaur = screenGame.colorAt(110, 460) === configs.dino_color_night;


let run = () => {
  let is_gameover = screenGame.colorAt(800, 360) === configs.dino_color_night; //Buttom hex color

  if(is_gameover) robot.keyTap("enter");
  loop = setTimeout(run, 1000/configs.fps);
}

run();