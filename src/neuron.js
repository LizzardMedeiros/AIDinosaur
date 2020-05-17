module.exports = function () {
  //Data
  this.data = {
    weight : [],
    bias : 0,
    trigger : 0,
    score : 0
  }

  //Cria um neuronio vazio
  this.generate = (size = 1) => {
    for(let i=0; i<size; i++){
      this.data.weight.push(randomRange(-10, 10));
    }
    this.data.bias = Math.random()*10;
    this.data.trigger = Math.random();
  };

  //Função de ativação
  this.g = (sign_array) => {
      let u = 0;
      //Atribui o peso à cada sinal
      for(let i=0; i<sign_array.length; i++){
        if(i == this.data.weight.length) break;
        u += sign_array[i] * this.data.weight[i];
      }
      //Somatória dos sinais - bias
      u -= this.data.bias;
      u = Math.tanh(u);

      if(u > this.data.trigger) return 1; //Ativado positivo
      else if(u < -this.data.trigger) return -1; //Ativado negativo
      else return 0;// não ativado
  };

  //Provoca Mutação
  this.mutation = () => {
    //Pesos
    for(let k=0; k<this.data.weight.length; k++){
      if(Math.random() <= .5) this.data.weight[k] += randomRange(-1, 1)*.01;
    }
    //Bias
    if(Math.random() <= .5) this.data.bias += randomRange(-1, 1)*.1;
    //Trigger
    if(Math.random() <= .5) this.data.trigger += randomRange(-1, 1)*.1;
  };
}

function randomRange(min, max){
  return Math.random() * (max - min) + min;
}