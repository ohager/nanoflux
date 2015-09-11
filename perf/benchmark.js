var fluxyPerf = require('../perf/fluxy-perf');
var fullfluxPerf = require('../perf/fullflux-perf');

var results = [];

function run(f){
    var r = f.start();
    results.push(r);
    console.log(r.name + ': ' + r.ops  + ' op/s, avg. ' + r.avg + ' ms per operation');
}

run(fluxyPerf);
run(fullfluxPerf);






