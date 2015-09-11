var fluxyPerf = require('../perf/fluxy-perf');
var fullfluxPerf = require('../perf/fullflux-perf');
var refluxPerf = require('../perf/reflux-perf');

var results = [];

function run(f){
    var r = f.start();
    results.push(r);
    console.log(r.name + ': ' + r.ops  + ' op/s, avg. ' + r.avg + ' ms per operation');
}

function analyseResults(){

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

run(fluxyPerf);
run(fullfluxPerf);
run(refluxPerf);

analyseResults();




