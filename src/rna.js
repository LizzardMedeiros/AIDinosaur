let neuron = require("./neuron");

module.exports = function () {

  this.neuron_array = [];
  this.neuron_outputs = [];
  this.configs = [];
  this.score = 0;

  this.createRNA = function (inputs, depth, height, outputs) {
    this.configs = [inputs, depth, height, outputs];
    for(i=0; i<depth; i++){
      this.neuron_array[i] = [];
      for(j=0; j<height; j++){
        this.neuron_array[i][j] = new neuron();
        this.neuron_array[i][j].generate(i==0 ? inputs : depth);
      }
    }

    for(i=0; i<outputs; i++){
      this.neuron_outputs[i] = new neuron();
      this.neuron_outputs[i].generate(height);
    }
    this.score = 0;
  };

  this.test = function (signal_array) {
    //armazena os outputs dos neuronios inputs
    let c_signal = [];
    let o_signal = [];

    for(i=0; i<this.neuron_array.length; i++){
      for(j=0; j<this.neuron_array[i].length; j++){
        if(i==0){
          c_signal[j] = this.neuron_array[i][j].g(signal_array, true);
        } else {
          c_signal[j] = this.neuron_array[i][j].g(c_signal[j], true);
        }
      }
    }
    this.neuron_outputs.forEach(n => {
      o_signal.push(n.g(c_signal));
    });

    return o_signal;
  };

  this.makeChild = function () {
    this.neuron_outputs.forEach((output) => {output.mutation()});
    this.neuron_array.forEach((n) => {
      n.forEach(k => {k.mutation()});
    });   
  };

  this.resetRNA = function () {
    this.neuron_outputs.forEach((output) => {output.generate()});
    this.neuron_array.forEach((n) => {
      n.forEach(k => {k.generate()});
    });
  };

  this.exportGenetics = function () {
    let data = {
      data : this.configs,
      n_array : [],
      n_outputs : []
    };
    this.neuron_array.forEach(n => {
      n.forEach(k => {
        data.n_array.push(k.data)
      });
    });
    this.neuron_outputs.forEach(n => {data.n_outputs.push(n.data)});

    return data;
  };

  this.importGenetics = function (gen) {
    this.createRNA(gen.data[0], gen.data[1], gen.data[2], gen.data[3]);

    let i=0;
    this.neuron_array.forEach(n => {
      n.forEach(k => {
        k.data = gen.n_array[i++];
      });
    });

    i=0;
    this.neuron_outputs.forEach(n => {n.data = gen.n_outputs[i++]});  
  };
};