#!/usr/bin/env node
var NanoFlux = require('../src/nanoflux');

var setup = function() {

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

};

// The full flux concept foresees a separation of actions and dispatcher
// Here we create an action provider using the more dynamic Dispatcher.dispatch method.
function ActionProvider(dispatcher){

    this.action1 = function(data){
        console.log("Action 1");
        // this way, the dispatcher establishes dynamically the action binding.
        dispatcher.dispatch('action1', data);
    };

    this.action2 = function(data){
        console.log("Action 2");
        dispatcher.dispatch('action2', data);
    }
}


function Component(){

    // callback called by Store.notify
    this.onNotify = function(data){
        console.log("Component notified: " + JSON.stringify(data));
    };

    this.exec = function(){

        // note, that in this example the dispatcher won't be created with any actions.
        // the actions are provided by the dedicated ActionProvider

        var dispatcher = NanoFlux.createDispatcher('myDispatcher');
        var store = NanoFlux.getStore('myStore');
        store.connectTo(dispatcher);
        // establishes the link between store's notification mechanism and this component.
        // use the returned object to unsubscribe, if needed!
        var subscription = store.subscribe(this, this.onNotify);

        // the 'full flux' way uses a separated ActionProvider
        var actions = new ActionProvider(dispatcher);

        actions.action1("test 1");
        actions.action2("test 2");
    };
}

setup();
new Component().exec();
