module.exports = function () {
  //Data
  this.data = {
    weight : [],
    trigger : 0,
    sensibility : 1
  }

  //Cria um neuronio vazio
  this.generate = (size = 1, sensibility = 1) => {
    this.data.sensibility = sensibility;
    for(let i=0; i<size; i++){
      this.data.weight[i] = randomRange(-sensibility, sensibility);
    }
    this.data.trigger = Math.random();
  };

  //Função de ativação
  this.g = (sign_array, no_trigger=false) => {
      let u = 0;
      //Atribui o peso à cada sinal
      for(let i=0; i<sign_array.length; i++){
        if(i == this.data.weight.length) break;
        u += sign_array[i] * this.data.weight[i];
      }

      if(no_trigger) return Math.tanh(u);

      if(u > this.data.trigger) return 1; //Ativado positivo
      else if(u < -this.data.trigger) return -1; //Ativado negativo
      else return 0;// não ativado
  };

  //Provoca Mutação
  this.mutation = () => {
    //Pesos
    for(let k=0; k<this.data.weight.length; k++){
      if(Math.random() <= .8) this.data.weight[k] += randomRange(-.1, .1)*this.data.sensibility;
    }
  };
}

function randomRange(min, max){
  return Math.random() * (max - min) + min;
}