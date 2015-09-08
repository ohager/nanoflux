#!/usr/bin/env node
var NanoFlux = require('./src/nanoflux');
var component = require('./component');
var myDispatcher = NanoFlux.createDispatcher('myDispatcher',['action1', 'action2']);
var myDispatcher1 = NanoFlux.createDispatcher('myDispatcher1', ['action3']);
var myDispatcher2 = NanoFlux.createDispatcher('myDispatcher2');


var myStore = NanoFlux.createStore( {

    onAction1 : function(test){
        console.log("Action 1: " + test);
        this.notify({data: test});
    },

    onAction2 : function(test){
        console.log("Action 2: " + test);
        this.notify({data: test});
    },

    onAction3 : function(test){
        console.log("Action 3: " + test);
        this.notify({data: test});
    }
});
// eventually put it into ctor, or think of disconnect
myStore.connectTo([myDispatcher, myDispatcher1]);

component.test();
