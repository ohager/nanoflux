"use strict";

function generateHandlerName(actionName) {
    return "on" + actionName[0].toUpperCase() + actionName.substr(1);
}

function Dispatcher(actions) {

    var self = this;
    this.__connectedStores = [];

    var createActionList = function (actionArray) {

        if(!Array.isArray(actionArray)){
            actionArray = [actionArray];
        }

        for (var i = 0; i < actionArray.length; ++i) {
            self.__registerAction(actionArray[i]);
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

    for (var i = 0; i < this.__connectedStores.length; ++i) {
        var store = this.__connectedStores[i];
        store[handler].apply(store, args);
    }
};

Dispatcher.prototype.__registerAction = function (actionName) {
    if(!this[actionName]) {
        this[actionName] = this.__callAction.bind(this, actionName);
    }
};

Dispatcher.prototype.connectTo = function (store) {

    if(!Array.isArray(store)){
        store = [store];
    }

    for(var i=0; i<store.length;++i){
        if(this.__connectedStores.indexOf(store[i])===-1){
            this.__connectedStores.push(store[i]);
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
        dispatchers[name] = new Dispatcher(actionArray);
        return dispatchers[name];
    },
    getDispatcher: function (name) {
        return dispatchers[name];
    }
};
