const neuron = require("./Neuron.js");
const dinosaur = require("./Dinosaur");

//Configurations
let configs = {
  steps : 20,
  fps : 16
};

//Cria um neurônio
neuron.generate(1);

//Loop
let loop = {};
let run = () => {
  let distance = dinosaur.getObstacleDistance();
  if(dinosaur.checkGameOver()){
    dinosaur.move(0);
  }
  else if(distance > 30 && distance < 900){
    dinosaur.move(0);
  }
  loop = setTimeout(run, 1000/configs.fps);
}
run();