let rna = require("./src/rna");
let best_dna = require("./genetics/best.json");

const machine = require("./src/machine");
const config = require("./configs/config.json");
const fs = require('fs');

//Define as variáveis gerais
let current_dino = 0;
let room_speed = 0;
let dinoAI = [];

//Cria a primeira geração de AIs com 2 sensores (distância e velocidade)
for(let i=0; i<config.dinos; i++){
  dinoAI[i] = new rna();
  if(Object.keys(best_dna).length > 0){
    dinoAI[i].importGenetics(best_dna.gen);
    if(i>0) dinoAI[i].makeChild();
    else console.log("importing...");
  } else {
    dinoAI[i].createRNA(2, 1, 2, 1);
  }
}

//Loop
let loop = {};
let runLoop = () => {
  if(!machine.checkGameScreen()) {
    console.log("Waiting machine Game...");
    loop = setTimeout(runLoop, 1000);
    return;
  } else if(machine.checkGameOver()) {
    if(room_speed > 0){
      dinoAI[current_dino].score = room_speed;
      room_speed = 0;
      current_dino++;
      machine.move("leave_keys");
    }
    if(current_dino == config.dinos) {
      createNewGeneration();
      return;
    }
    machine.move("start");
    loop = setTimeout(runLoop, 1000);
    return;
  } else {
    room_speed++;
    let distance = machine.getObstacleDistance();
    if(distance != -1){
      let signals = [Math.floor(machine.screenSize.width/distance), Math.floor(10/room_speed)];
      signals = dinoAI[current_dino].test(signals);
      if(signals[0] == 1) machine.move("jump"); //pula
      else if (signals[0] == -1) machine.move("crouch"); //abaixa
      else machine.move("leave");
    }
    loop = setTimeout(runLoop, 1000/config.fps);   
  }
}

//New Generation
let createNewGeneration = () => {

  //Verifica se nenhum dinossauro teve sucesso, caso positivo, gera novos pesos aleatórios
  let best_dino_id = -1;
  for(i=0; i<dinoAI.length; i++){
    if(dinoAI[i].score > config.min_score){
      if(best_dino_id == -1) best_dino_id = i;
      else if(dinoAI[i].score > dinoAI[best_dino_id].score) best_dino_id = i;
    }
  }

  if(best_dino_id == -1){
    dinoAI.forEach(dino => {
      dino.resetRNA();
    });
  } else {
    let scr = (best_dna.hasOwnProperty("score")) ? best_dna.score : 0;
    let gen = dinoAI[best_dino_id].exportGenetics();

    if(dinoAI[best_dino_id].score > scr){
      console.log("New record reached!", dinoAI[best_dino_id].score);
      dt = {score:dinoAI[best_dino_id].score, gen:gen};
      fs.writeFile("./genetics/best.json", JSON.stringify(dt), e => {if(e)console.error(e)});
    }

    dinoAI.forEach(dino => {
      dino.importGenetics(gen);
      dino.makeChild();
    });    

  }
  current_dino = 0;
  runLoop();
}

setTimeout(runLoop, 3000);
