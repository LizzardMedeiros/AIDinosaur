const neuron = require("./Neuron.js");
const dinosaur = require("./Dinosaur");

//Configurations
let configs = {
  dinos : 10,
  fps : 16
};

let current_generation = 0;
let room_speed = 0;

//Cria a primeira geração de AIs com 2 sensores (distância e velocidade)
let dinoAI = [];

for(let i=0; i<configs.dinos; i++){
  dinoAI[i] = Object.create(neuron);
  dinoAI[i].generate(2);
}

console.log(dinoAI);

//Setup
let setup = {};
let runSetup = () => {
  //Verifica se está na tela do jogo
  if(dinosaur.checkGameScreen()){
    runLoop();
    timer();
    return;
  }
  clearTimeout(setup);
  setup = setTimeout(runSetup, 1000);
};

//Loop
let loop = {};
let runLoop = () => {
  if(dinosaur.checkGameOver() && room_speed > 3){
    dinosaur.move(0);//começa o jogo
    dinoAI[current_generation].score = room_speed;
    console.log(current_generation);
    if(current_generation === configs.dinos){
      clearTimeout(loop);
      return;
    }
    room_speed = 0;
    current_generation++;
  }else if(!dinosaur.checkGameOver()){
    //Verifica se existe obstáculo
    let distance = dinosaur.getObstacleDistance();
    if(distance != -1){
      //Verifica o sinal do neurônio e executa uma ação
      let signals = [distance, room_speed];//Distancia e velocidade
      signals = dinoAI[current_generation].g(signals);
      if(signals == 1) dinosaur.move(0);//pula
      else if (signals == -1) dinosaur.move(1);//abaixa
    }
  }
  clearTimeout(loop);
  loop = setTimeout(runLoop, 1000/configs.fps);
}

//Room Speed
let timer = () => {
  room_speed++;
  clearTimeout(timer);
  setTimeout(timer, 1000);
};

runSetup();