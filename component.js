var NanoFlux = require("./src/nanoflux");

function Component(){

    this.onNotify = function(data){
        console.log(JSON.stringify(data));
    };

    this.test = function(){
        var dispatcher = NanoFlux.getDispatcher('myDispatcher');
        var subscription = dispatcher.subscribe(this, this.onNotify);

        dispatcher.action1("test 1.1");
        dispatcher.action2("test 2.1");
        dispatcher.action2("test 2.2");

        subscription.unsubscribe();

        dispatcher.action1("test 1.2");

    };
}

module.exports = new Component();

