#!/usr/bin/env node
var NanoFlux = require('../src/nanoflux');

var setup = function() {

    // Create the dispatcher with one or many actions
    // The passed action names become functions of the dispatcher
    var myDispatcher = NanoFlux.createDispatcher('myDispatcher', ['action1', 'action2']);
    var myDispatcher1 = NanoFlux.createDispatcher('myDispatcher1', ['action3']);

    // Creating a store 'myStore' with functions triggered by dispatched actions
    // The convention for action handlers name is: on<ActionName>
    var myStore = NanoFlux.createStore('myStore', {

        // the handlers signature bases on the users convention
        onAction1: function (test) {
            console.log("Store.onAction1: " + test);
            // this will call the subscribed callbacks
            this.notify({data: test});
        },

        onAction2: function (test) {
            console.log("Store.onAction2: " + test);
            this.notify({data: test});
        },

        onAction3: function (test) {
            console.log("Store.onAction3: " + test);
            this.notify({data: test});
        }
    });

    // Establish the link between one or more dispatchers and the store.
    // On connection the actions of the passed dispatchers will be
    // mapped to the stores action handlers following the mentioned
    // naming convention.
    // A warning will be thrown, if store does not provide a certain
    // action handler and its mapping is being ignored.
    myStore.connectTo([myDispatcher, myDispatcher1]);
};

function Component(){

    // callback called by Store.notify
    this.onNotify = function(data){
        console.log("Component notified: " + JSON.stringify(data));
    };

    this.exec = function(){

        var dispatcher = NanoFlux.getDispatcher('myDispatcher');
        var store = NanoFlux.getStore('myStore');

        // establishes the link between store's notification mechanism and this component.
        // use the returned object to unsubscribe, if needed!
        var subscription = store.subscribe(this, this.onNotify);

        // trigger actions
        // The 'fluxy' approach provides actions as functions of the dispatcher
        dispatcher.action1("test 1.1");
        dispatcher.action2("test 2.1");
        dispatcher.action2("test 2.2");

        // won't work, because myDispatcher1 does not provide 'action3'
        // dispatcher.action3("test 3.1");

        // remove subscription to store
        subscription.unsubscribe();

        // won't call onNotify, but action1 or Store.onAction1 is called anyway
        dispatcher.action1("test 1.2");

    };
}

setup();
new Component().exec();
