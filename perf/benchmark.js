var PerfRunner = require('../perf/perfrunner');
var fluxyPerf = require('../perf/fluxy-perf');
var fullfluxPerf = require('../perf/fullflux-perf');
var refluxPerf = require('../perf/reflux-perf');

new PerfRunner().startBenchmark([fluxyPerf,fullfluxPerf,refluxPerf]);



