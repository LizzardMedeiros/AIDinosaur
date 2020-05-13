const robot = require("robotjs");
let neuron = require("./Neuron.js");

//Configurations
let configs = {
  steps : 20,
  dino_color_night : "acacac",
  fps : 24,
  screenSize : robot.getScreenSize(),
  screenGame : robot.screen.capture(0, 100, this.screenSize.width, 500)
};

//Cria um neurônio
neuron.generate(1);

//Loop
let loop = {};
let run = () => {
  let is_gameover = screenGame.colorAt(800, 360) === configs.dino_color_night;

  if(is_gameover) robot.keyTap("enter");
  loop = setTimeout(run, 1000/configs.fps);
}

run();