let neuron = require("./Neuron.js");
const dinosaur = require("./Dinosaur");
const config = require("./configs/config.json");
const best_dna = require("./genetics/best.json");
const fs = require('fs');

//Define as variáveis gerais
let current_dino = 0;
let bestDino = -1;
let room_speed = 0;
let dinoAI = [];

//Cria a primeira geração de AIs com 2 sensores (distância e velocidade)

let createDino = (force_new=false) => {
  dinoAI = [];
    for(let i=0; i<config.dinos; i++){
      dinoAI[i] = new neuron();
      if(Object.keys(best_dna).length === 0 && force_new) dinoAI[i].generate(2);
      else{
        dinoAI[i].data = best_dna;
        if(i>0) dinoAI[i].mutation();
      }
    }
}
createDino();

//Loop
let loop = {};
let runLoop = () => {
  if(!dinosaur.checkGameScreen()) {
    console.log("Waiting Dinosaur Game...");
    loop = setTimeout(runLoop, 1000);
    return;
  } else if(dinosaur.checkGameOver()) {
    if(room_speed > 0){
      dinosaur.move("leave");
      dinoAI[current_dino].data.score = room_speed;
      if(room_speed > config.first_obstacle){
        if(bestDino == -1) bestDino = current_dino;
        else bestDino = (dinoAI[bestDino].data.score > room_speed) ? bestDino : current_dino;
      }
      current_dino++;
    }
    if(current_dino == config.dinos) {
      room_speed = 0;
      current_dino = 0;
      createNewGeneration();
      return;
    }
    room_speed = 0;
    dinosaur.move("start");
    loop = setTimeout(runLoop, 1000);
    return;
  } else {
    room_speed++;
    let distance = dinosaur.getObstacleDistance();
    if(distance != -1){
      let signals = [Math.floor(dinosaur.screenSize.width/distance), Math.floor(10/room_speed)];
      signals = dinoAI[current_dino].g(signals);
      if(signals == 1) dinosaur.move("jump"); //pula
      else if (signals == -1) dinosaur.move("crouch"); //abaixa
      else dinosaur.move("leave");
    }
    loop = setTimeout(runLoop, 1000/config.fps);   
  }
}

//New Generation
let createNewGeneration = () => {
  //Verifica se nenhum dinossauro teve sucesso, caso positivo, gera novos pesos aleatórios
  if(bestDino == -1){
    console.log("Atribuindo nova geração aleatória");
    createDino(true);
  } else {//Senão substitui a geração por clones do melhor da última geração e gera alguma mutação nos descendentes
    let data = dinoAI[bestDino].data;
    if(data.score > best_dna.score || !best_dna.hasOwnProperty("score")) fs.writeFile("./genetics/best.json", JSON.stringify(data), e => {if(e)console.log(e);});
    data.score = 0;
    for(let i=0; i<dinoAI.length; i++){
      dinoAI[i].data = data;
      if(i>0) dinoAI[i].mutation(); //provoca mutação em todos, menos no primeiro
    }
  }
  bestDino = -1;
  runLoop();
}
runLoop();