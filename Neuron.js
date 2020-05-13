let Neuron = {
  //Data
  weight : [],
  bias : 0,
  trigger : 0,
  score : 0,

  //Cria um neuronio vazio
  generate : function(size = 1){
    for(let i=0; i<size; i++){
      this.weight.push(randomRange(-1, 1));
    }
    this.bias = Math.random();
    this.trigger = Math.random();
  },

  //Função de ativação
  g : function(sign_array){
      let u = 0;
      //Atribui o peso à cada sinal
      for(let i=0; i<sign_array.length; i++){
        if(i == this.weight.length) break;
        u += sign_array[i] * this.weight[i];
      }
      //Somatória dos sinais - bias
      u -= this.bias;

      if(u > this.trigger) return 1; //Ativado
      else if(u < -this.trigger) return -1;
      else return 0;// não ativado
  },

  //Provoca Mutação
  mutation : function(){
    //Pesos
    for(let i=0; i<this.weight.length; i++){
      if(Math.random() <= .2) this.weight += randomRange(-1, 1);
    }
    //Bias
    if(Math.random() <= .2) this.bias += randomRange(-1, 1);
    //Trigger
    if(Math.random() <= .2) this.trigger += randomRange(-1, 1);
  },

  //Retorna informações do neurônio
  getNeuron : function(){
    return {
      weight : this.weight,
      bias : this.bias,
      trigger : this.trigger
    }
  }
}

function randomRange(min, max){
  return Math.random() * (max - min) + min;
}

module.exports = Neuron;