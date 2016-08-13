"use strict";

module.exports  = function (opts){

    var results = [];
    var options = { verbose : true, showStatistics : true };

    (function(){
        for(var o in opts){
            if(opts.hasOwnProperty(o)){
                options[o] = opts[o];
            }
        }
    })();


    var run = function(test){

        console.log("Running test '" + test.getName() + "'");

        var r = test.start();
        results.push(r);
        if(options.verbose){
            console.log(r.name + ': ' + r.ops  + ' op/s, avg. ' + r.avg + ' ms per operation\n');
        }

    };

    this.startBenchmark = function(perftests){

        if(options.verbose){
            console.log("Benchmark started...\n");
        }

        results = [];

        if(!Array.isArray(perftests)){
            perftests = [perftests];
        }

        perftests.forEach(function(test){
             run(test);
        });

        if(options.showStatistics){
            this.showStatistics();
        }

        console.log("\nBenchmark finished!\n");
    };

    this.showStatistics = function(){

        console.log('\nResult:\n-------------------------------\n');

        results.sort( function(a,b){
            return b.ops - a.ops;
        });
        var fastest = results[0];

        for(var i = 0; i < results.length; ++i){
            var r = results[i];
            var percent = (r.ops / fastest.ops) * 100.00;

            console.log( i+1 + '. ' + r.name + ': ' + r.ops + ' op/s (' + (r.ops - fastest.ops).toFixed(2) + ' op/s) - ' + percent.toFixed(2) + '%' );
        }
    }

};
