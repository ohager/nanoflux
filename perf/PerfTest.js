"use strict";

function PerfTest(name, runner){


    var __constructor = function(){
        for(var prop in runner){
            if(runner.hasOwnProperty(prop)){
                this[prop] = runner[prop];
            }
        }

        if(!this.exec && !this.execAsync) throw "No 'exec' nor 'execAsync' method defined";

    }.bind(this);

    __constructor();

    this.getName = function(){ return name; };

    this.start = function(){

        var overallElapsed = 0;
        var iterations = 0;
        var elapsedTime = 0;
        var rounds = 3;
        var i = 0;
        var start = 0;

        if(this.before){
            this.before.call(this);
        }

        if(this.exec){

            for(i = 0; i < rounds; ++i){

                start = Date.now();
                while(elapsedTime <= 1000){
                    this.exec.call(this,i);
                    elapsedTime = Date.now() - start;
                    ++iterations;
                }
                overallElapsed += elapsedTime;
                elapsedTime = 0;
            }

        }

        if(this.after) {
            this.after.call(this);
        }

        var ops = (iterations/rounds).toFixed(2);
        var avg = (overallElapsed/ops).toFixed(3);

        return {
            name : name,
            ops : ops,
            avg : avg
        }
    }
}

// --------------------------------------

module.exports = {
    createPerfTest : function(name, runner){
        return new PerfTest(name,runner);
    }
};
