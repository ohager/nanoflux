!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.NanoFlux=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";

function ActionCreator(dispatcher, descriptor){
    this.__dispatcher = dispatcher;
    this.__constructor(descriptor);
}

ActionCreator.prototype.__constructor = function (descriptor) {
    for(var func in descriptor){
        if(descriptor.hasOwnProperty(func)){
            this[func] = descriptor[func];
        }
    }
};

ActionCreator.prototype.dispatch = function(actionname, data){
    this.__dispatcher.dispatch(actionname, data);
};

var actioncreators = {};

module.exports = {
	clear: function(){
		actioncreators = {};
	},
    create: function (name, dispatcher, descriptor) {
        if(!name || name.length===0){
            throw "Empty names are not allowed";
        }

        actioncreators[name] = new ActionCreator(dispatcher, descriptor);
        return actioncreators[name];
    },

    getActions: function (name) {
        return actioncreators[name];
    }
};

},{}],2:[function(_dereq_,module,exports){
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

},{}],3:[function(_dereq_,module,exports){
"use strict";
var storeFactory = _dereq_('./store');
var dispatcherFactory = _dereq_('./dispatcher');
var actionCreatorFactory = _dereq_('./actioncreator');

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

},{"./actioncreator":1,"./dispatcher":2,"./store":4}],4:[function(_dereq_,module,exports){
"use strict";

function Subscription(subscriber, arr) {

    var subscriptionList = arr;
    var handle = subscriber;

    this.unsubscribe = function () {
        var index = arr.indexOf(handle);
        subscriptionList.splice(index, 1);
    };
}

function Store(descriptor) {

    this.__constructor(descriptor);
    this.__subscriptionList = [];
}

Store.prototype.__constructor = function (descriptor) {
    for(var func in descriptor){
        if(descriptor.hasOwnProperty(func)){
            this[func] = descriptor[func];
        }
    }

    if(this.onInitialize){
        this.onInitialize();
    }
};

Store.prototype.subscribe = function (context, func) {
    var subscriber = {context: context, func: func};
    this.__subscriptionList.push(subscriber);
    return new Subscription(subscriber, this.__subscriptionList);
};

Store.prototype.notify = function () {
    for (var i = 0; i < this.__subscriptionList.length; ++i) {
        var subscriber = this.__subscriptionList[i];
        subscriber.func.apply(subscriber.context, arguments);
    }
};

var stores = {};
module.exports = {
	clear : function() {
		stores = {};
	},
    create: function (name, storeDescriptor) {
        stores[name] = new Store(storeDescriptor);
        return stores[name];
    },
    getStore: function (name) {
        return stores[name];
    }

};


},{}]},{},[3])
(3)
});