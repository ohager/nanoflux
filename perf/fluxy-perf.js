#!/usr/bin/env node
var PerfTest = require('../perf/perftest');
var NanoFlux = require('../dist/nanoflux.min');


module.exports = PerfTest.createPerfTest('nanoflux-fluxy-perf', {
    dispatcher : NanoFlux.createDispatcher('myDispatcher', ['action1', 'action2']),
    store : NanoFlux.createStore('myStore', {

        onAction1: function (test) {
            this.notify({data: test});
        },

        onAction2: function (test) {
            this.notify({data: test});
        }
    }),

   before : function(){
       this.dispatcher.connectTo(this.store);
       this.store.subscribe(this, function(data){
           var localData = data; // copy operation
       });
   },

    exec : function(i){
        this.dispatcher.action1("test 1." + i);
        this.dispatcher.action2("test 2." + i);
    },

    after : function(){
    }

});

