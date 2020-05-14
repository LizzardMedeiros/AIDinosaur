let neuron = require("./Neuron.js");
const dinosaur = require("./Dinosaur");

//Configurations
let configs = {
  dinos : 5,
  fps : 16
};

let current_generation = 0;
let room_speed = 0;

//Cria a primeira geração de AIs com 2 sensores (distância e velocidade)
let dinoAI = [];

for(let i=0; i<configs.dinos; i++){
  dinoAI[i] = new neuron();
  dinoAI[i].generate(2);
}

//Setup
let setup = {};
let runSetup = () => {
  //Verifica se está na tela do jogo
  if(dinosaur.checkGameScreen() && dinosaur.checkGameOver()){
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

  if(current_generation == configs.dinos){
    clearTimeout(loop);
    clearTimeout(timer);
    createNewGeneration();
    return;
  } else if (dinosaur.checkGameOver() && room_speed > 3){

    dinosaur.move(0);//começa o jogo
    dinoAI[current_generation].score = room_speed;
    room_speed = 0;
    current_generation++;

  } else if (!dinosaur.checkGameOver()){

    //Verifica se existe obstáculo
    let distance = dinosaur.getObstacleDistance();
    if(distance != -1){

      /*
      * Verifica o sinal do neurônio e executa uma ação
      * Como a distância representa números muito grandes e a velocidade número muito pequeno
      * decidi modular os valores da distância dividindo por 10
      */
      
      let signals = [ 
        distance*.65, //Distância
        room_speed //Velocidade
      ];

      signals = dinoAI[current_generation].g(signals);
      if(signals == 1) dinosaur.move(0);//pula
      else if (signals == -1) dinosaur.move(1);//abaixa

    }

  }
  loop = setTimeout(runLoop, 1000/configs.fps);
}

//New Generation
let createNewGeneration = () => {
  let best_neuron = new neuron();
  let best_id = -1;

  //Pega o melhor da última geração
  for(let i=0; i<dinoAI.length; i++){
    if(best_neuron.score < dinoAI[i].score && dinoAI[i].score > 6){
      best_id = i;
      best_neuron.weight = dinoAI[i].weight;
      best_neuron.bias = dinoAI[i].bias;
      best_neuron.trigger = dinoAI[i].trigger;
      best_neuron.score = dinoAI[i].score;
    }
  }

  //Verifica se nenhum dinossauro teve sucesso, caso positivo, gera novos pesos aleatórios
  if(best_id == -1){
    console.log("Nenhum aprovado... Gerando novos");
    for(let i=0; i<configs.dinos; i++){
      dinoAI[i] = new neuron();
      dinoAI[i].generate(2);
    }    
  } else //Senão substitui a geração por clones do melhor da última geração e gera alguma mutação nos descendentes
  for(let i=0; i<dinoAI.length; i++){
    dinoAI[i].weight = best_neuron.weight;
    dinoAI[i].bias = best_neuron.bias;
    dinoAI[i].trigger = best_neuron.trigger;
    dinoAI[i].score = best_neuron.score;
    //provoca mutação em todos, menos no primeiro
    if(i>0) dinoAI[i].mutation();
  }
  current_generation = 0;
  runSetup();
}

//Room Speed
let timer = () => {
  room_speed++;
  clearTimeout(timer);
  setTimeout(timer, 1000);
};

runSetup();