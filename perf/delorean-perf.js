#!/usr/bin/env node
var PerfTest = require('../perf/perftest');
var DeLorean = require('../perf/lib/delorean.min');

var store = DeLorean.Flux.createStore({

    data : {},

    actions : {
        action1 : 'onAction1',
        action2 : 'onAction2'
    },

    onAction1: function (data) {
        this.data = data;
        this.emit('change');
    },

    onAction2: function (data) {
        this.data = data;
        this.emit('change');
    }

});


var dispatcher = DeLorean.Flux.createDispatcher({
    action1: function (data) {
        this.dispatch('action1', data);
    },
    action2: function (data) {
        this.dispatch('action2', data);
    },
    getStores : function(){
        return {
            store : store
        }
    }
});

var actions =  {
    action1: function (test) {
        dispatcher.action1(test);
    },
    action2: function (test) {
        dispatcher.action2(test);
    }
};

module.exports = PerfTest.createPerfTest('delorean-perf', {


    before: function () {
        store.onChange(function () {
            var localData = store.data; // copy operation
        }.bind(this));
    },

    exec: function (i) {
        actions.action1("test 1." + i);
        actions.action2("test 2." + i);
    },

    after: function () {
    }

});

