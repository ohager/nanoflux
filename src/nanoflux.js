"use strict";
var storeFactory = require('./store');
var dispatcherFactory = require('./dispatcher');

module.exports = {

    createStore: function (name, descriptor) {
        return storeFactory.create(name, descriptor);
    },

    createDispatcher: function (name, actionList) {
        return dispatcherFactory.create(name, actionList);
    },

    getDispatcher : function(name){
        return dispatcherFactory.getDispatcher(name);
    },

    getStore : function(name){
        return storeFactory.getStore(name);
    }

};
