#!/usr/bin/env node
var PerfTest = require('../perf/perftest');
var NanoFlux = require('../src/nanoflux');

function ActionProvider(dispatcher){

    this.action1 = function(data){
        dispatcher.dispatch('action1', data);
    };

    this.action2 = function(data){
        dispatcher.dispatch('action2', data);
    }
}

module.exports = PerfTest.createPerfTest('fullflux-perf', {
    dispatcher : NanoFlux.createDispatcher('myDispatcher'),
    store : NanoFlux.createStore('myStore', {

        onAction1: function (test) {
            this.notify({data: test});
        },

        onAction2: function (test) {
            this.notify({data: test});
        }
    }),
    actions : {},

   before : function(){
       this.actions = new ActionProvider(this.dispatcher);
       this.dispatcher.connectTo(this.store);
       this.store.subscribe(this, function(data){
           var localData = data; // copy operation
       });
   },

    exec : function(i){
        this.actions.action1("test 1." + i);
        this.actions.action2("test 2." + i);
    },

    after : function(){
    }

});

