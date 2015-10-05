!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.NanoFlux=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";

function generateHandlerName(actionName) {
    return "on" + actionName[0].toUpperCase() + actionName.substr(1);
}

function guaranteeArray(obj){
    return !Array.isArray(obj) ? [obj] : obj;
}

function Dispatcher(actions) {

    var self = this;
    this.__stores = [];

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

Dispatcher.prototype.__callAction = function(){
    var handler = generateHandlerName(arguments[0]);
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
    this.__registerAction(actionName);
    this[actionName](data);
};

var dispatchers = {};

module.exports = {
    create: function (name, actionArray) {
        if(!name || name.length===0){
            throw "Empty names are not allowed";
        }

        dispatchers[name] = new Dispatcher(actionArray);
        return dispatchers[name];
    },
    getDispatcher: function (name) {
        return dispatchers[name];
    }
};

},{}],2:[function(_dereq_,module,exports){
"use strict";
var storeFactory = _dereq_('./store');
var dispatcherFactory = _dereq_('./dispatcher');

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

},{"./dispatcher":1,"./store":3}],3:[function(_dereq_,module,exports){
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

    create: function (name, storeDescriptor) {
        stores[name] = new Store(storeDescriptor);
        return stores[name];
    },
    getStore: function (name) {
        return stores[name];
    }

};


},{}]},{},[2])
(2)
});