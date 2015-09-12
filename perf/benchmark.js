var PerfRunner = require('../perf/perfrunner');
var fluxyPerf = require('../perf/fluxy-perf');
var fullfluxPerf = require('../perf/fullflux-perf');
var refluxPerf = require('../perf/reflux-perf');
var deloreanPerf = require('../perf/delorean-perf');

new PerfRunner().startBenchmark([
    fluxyPerf,
    fullfluxPerf,
    refluxPerf,
    deloreanPerf]);


