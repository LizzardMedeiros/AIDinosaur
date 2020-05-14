let neuron = require("./Neuron.js");
const dinosaur = require("./Dinosaur");

//Configurations
let configs = {
  dinos : 10,
  fps : 16,
  first_obstacle : 7
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
    createNewGeneration();
    return;
  } else if (dinosaur.checkGameOver() && room_speed > 0){

    dinoAI[current_generation].score = room_speed;
    room_speed = 0;

    current_generation++;

    dinosaur.move(0);//começa o jogo
    loop = setTimeout(runLoop, 1000);

  } else {
    //Contagem de tempo
    room_speed++;

    //Verifica se existe obstáculo
    let distance = dinosaur.getObstacleDistance();
    if(distance != -1){

      /*
      ** Verifica o sinal do neurônio e executa uma ação
      ** Como a distância representa números muito grandes e a velocidade número muito pequeno
      ** decidi modular os valores da distância dividindo por 100
      */
      
      let signals = [ 
        1000/distance, //Distância
        room_speed //Velocidade
      ];

      signals = dinoAI[current_generation].g(signals);
      if(signals == 1) dinosaur.move(0);//pula
      else if (signals == -1) dinosaur.move(1);//abaixa

    }
    loop = setTimeout(runLoop, 1000/configs.fps);
  }
}

//New Generation
let createNewGeneration = () => {
  let best_neuron_data = {
      id : -1,
      weight : [],
      bias : 0,
      trigger : 0,
      score : 0
  };

  //Pega o melhor da última geração
  for(let i=0; i<dinoAI.length; i++){
    if(best_neuron_data.score < dinoAI[i].score && dinoAI[i].score > configs.first_obstacle){
      best_neuron_data.id = i;
      best_neuron_data.weight = dinoAI[i].weight;
      best_neuron_data.bias = dinoAI[i].bias;
      best_neuron_data.trigger = dinoAI[i].trigger;
      best_neuron_data.score = dinoAI[i].score;
    }
  }

  //Verifica se nenhum dinossauro teve sucesso, caso positivo, gera novos pesos aleatórios
  if(best_neuron_data.id == -1){
    console.log("Atribuindo nova geração aleatória");
    dinoAI = [];
    for(let i=0; i<configs.dinos; i++){
      dinoAI[i] = new neuron();
      dinoAI[i].generate(2);
    }    
  } else {//Senão substitui a geração por clones do melhor da última geração e gera alguma mutação nos descendentes
    console.log("Nova geração filha de dino", best_neuron_data.id);
    for(let i=0; i<dinoAI.length; i++){
      dinoAI[i].weight = best_neuron_data.weight;
      dinoAI[i].bias = best_neuron_data.bias;
      dinoAI[i].trigger = best_neuron_data.trigger;
      //provoca mutação em todos, menos no primeiro
      if(i>0) dinoAI[i].mutation();
    }
  }
  current_generation = 0;
  runSetup();
}

runSetup();