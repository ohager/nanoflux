"use strict";
var storeFactory = require('./store');
var dispatcherFactory = require('./dispatcher');
var actionCreatorFactory = require('./actioncreator');

module.exports = {

    createStore: function (name, descriptor) {
        return storeFactory.create(name, descriptor);
    },

    createDispatcher: function (name, actionList) {
        return dispatcherFactory.create(name, actionList);
    },
    createActions: function(name, dispatcher, descriptor){
        return actionCreatorFactory.create(name, dispatcher, descriptor);
    },
    getDispatcher : function(name){
        return dispatcherFactory.getDispatcher(name);
    },

    getStore : function(name){
        return storeFactory.getStore(name);
    },

    getActionCreator : function(name){
        return actionCreatorFactory.getActionCreator(name);
    }

};
