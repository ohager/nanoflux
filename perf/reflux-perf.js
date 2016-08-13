#!/usr/bin/env node
var PerfTest = require('../perf/perftest');
var Reflux = require('../perf/lib/reflux.min');

var demoActions = Reflux.createActions([
    'action1',
    'action2'
]);


module.exports = PerfTest.createPerfTest('reflux-perf', {

    store: Reflux.createStore({
        listenables: demoActions,

        onAction1: function (test) {
            this.trigger({data: test});
        },

        onAction2: function (test) {
            this.trigger({data: test});
        }

    }),


    before: function () {
        this.store.listen(function (data) {
            var localData = data; // copy operation
        });
    },

    exec: function (i) {
        demoActions.action1("test 1." + i);
        demoActions.action2("test 2." + i);
    },

    after: function () {
    }

});

