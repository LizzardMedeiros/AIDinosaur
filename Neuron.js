function Neuron(){
  //Data
  this.weight = [];
  this.bias = 0;
  this.trigger = 0;
  this.score = 0;

  //Cria um neuronio vazio
  this.generate = (size = 1) => {
    for(let i=0; i<size; i++){
      this.weight.push(randomRange(-1, 1));
    }
    this.bias = Math.random()*3;
    this.trigger = Math.random()*8;
  };

  //Função de ativação
  this.g = (sign_array) => {
      let u = 0;
      //Atribui o peso à cada sinal
      for(let i=0; i<sign_array.length; i++){
        if(i == this.weight.length) break;
        u += sign_array[i] * this.weight[i];
      }
      //Somatória dos sinais - bias
      u -= this.bias;

      if(u > this.trigger) return 1; //Ativado positivo
      else if(u < -this.trigger) return -1; //Ativado negativo
      else return 0;// não ativado
  };

  //Provoca Mutação
  this.mutation = () => {
    //Pesos
    for(let k=0; k<this.weight.length; k++){
      if(Math.random() <= .2) this.weight[k] += randomRange(-1, 1) * 0.001;
    }
    //Bias
    if(Math.random() <= .2) this.bias += randomRange(-1, 1) * 0.1;
    //Trigger
    if(Math.random() <= .2) this.trigger += randomRange(-1, 1) * 0.1;
  };
}

function tgh(number){
  return 1 - 2/(Math.pow(Math.E, number) + 1);
}

function randomRange(min, max){
  return Math.random() * (max - min) + min;
}

module.exports = Neuron;