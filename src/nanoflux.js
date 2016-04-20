"use strict";
var storeFactory = require('./store');
var dispatcherFactory = require('./dispatcher');
var actionCreatorFactory = require('./actioncreator');

module.exports = {
	reset : function(){
		dispatcherFactory.clear();
		storeFactory.clear();
		actionCreatorFactory.clear();
	},
	
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

    getActions: function(name){
        return actionCreatorFactory.getActions(name);
    }

};
