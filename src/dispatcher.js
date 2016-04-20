"use strict";

function guaranteeArray(obj){
    return !Array.isArray(obj) ? [obj] : obj;
}

function Dispatcher(actions) {

	var self = this;
    this.__stores = [];
	this.__handlerMapCache = {};
	this.__isDispatching = false;

    var createActionList = function (actionArray) {

        var actions = guaranteeArray(actionArray);

        for (var i = 0; i < actions.length; ++i) {
            self.__registerAction(actions[i]);
        }
    };

    var initialize = function () {
        if (actions) {
            createActionList(actions);
        }
    };

    initialize();
}

Dispatcher.prototype.__getHandlerName = function(actionName){
	var r = this.__handlerMapCache[actionName];
	if(!r){
		r = "on" + actionName[0].toUpperCase() + actionName.substr(1);
		this.__handlerMapCache[actionName] = r;
	}
	return r;
};

Dispatcher.prototype.__callAction = function(){
    var handler = this.__getHandlerName(arguments[0]);
    var args = Array.prototype.slice.call(arguments,1);

    for (var i = 0; i < this.__stores.length; ++i) {
        var store = this.__stores[i];
        if(store[handler]){
            store[handler].apply(store, args);
        }
	}
};

Dispatcher.prototype.__registerAction = function (actionName) {
    if(!this[actionName]) {
        this[actionName] = this.__callAction.bind(this, actionName);
    }
};

Dispatcher.prototype.connectTo = function (storeArray) {

    var stores = guaranteeArray(storeArray);

    for(var i=0; i<stores.length;++i){
        if(this.__stores.indexOf(stores[i])===-1){
            this.__stores.push(stores[i]);
        }
    }

};

Dispatcher.prototype.dispatch = function (actionName, data) {

	if(this.__isDispatching){
		throw "DISPATCH WHILE DISPATCHING: Don't trigger any action in your store callbacks!";
	}

	try {
		this.__isDispatching = true;
		this.__registerAction(actionName);
		this[actionName](data);
	}catch(e){
		console.error(e);
		throw e;
	}
	finally{
		this.__isDispatching = false;
	}
};

var dispatchers = {};
var defaultDispatcherName = "__defDispatcher";

function __getDispatcher(name, actionArray){

	if(!name){
		name = defaultDispatcherName;
	}

	if(!dispatchers[name]){
		dispatchers[name] = new Dispatcher(actionArray);
	}
	return dispatchers[name];
}

module.exports = {
	clear: function(){ dispatchers = {}; },
    create: function (name, actionArray) {
    	return __getDispatcher(name, actionArray);
    },
    getDispatcher: function (name) {
        return __getDispatcher(name);
    }
};
