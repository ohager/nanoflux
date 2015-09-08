var storeFactory = require('./store');
var dispatcherFactory = require('./dispatcher');

var dispatcher = {};

module.exports = {

    createStore: function (descriptor) {
        return storeFactory.create(descriptor);
    },

    createDispatcher: function (name, actionList) {
        dispatcher[name] = dispatcherFactory.create(actionList);
        return dispatcher[name];
    },

    getDispatcher : function(name){
        return dispatcher[name];
    }

};
