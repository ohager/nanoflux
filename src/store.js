/**
 * Created by oliver on 05/09/2015.
 */
function Store(descriptor) {

    this.__constructor(descriptor);
    this.__connectedDispatchers = [];


}

Store.prototype.__constructor = function (descriptor) {
    var self = this;
    for(var func in descriptor){
        if(descriptor.hasOwnProperty(func)){
            self[func] = descriptor[func];
        }
    }
};


Store.prototype.__generateHandlerName = function (actionName) {
    return "on" + actionName[0].toUpperCase() + actionName.substr(1);
};

Store.prototype.__bindAction = function (dispatcher, actionName) {
    var self = this;
    var handlerName = this.__generateHandlerName(actionName);
    if(self[handlerName]) {
        dispatcher[actionName] = self[handlerName].bind(this);
    }
};

Store.prototype.connectTo = function (dispatcherArray) {

    if (!Array.isArray(dispatcherArray)) {
        dispatcherArray = [dispatcherArray];
    }

    for (var i = 0; i < dispatcherArray.length; ++i) {

        var dispatcher = dispatcherArray[i];
        var actionNames = dispatcher.getActionNames();

        for (var j = 0; j < actionNames.length; ++j) {
            this.__bindAction(dispatcher, actionNames[j]);
        }
    }
    this.__connectedDispatchers = dispatcherArray;
};

Store.prototype.notify = function () {
    var dispatchers = this.__connectedDispatchers;
    for (var i = 0; i < dispatchers.length; ++i) {
        var dispatcher = dispatchers[i];
        dispatcher.notify.apply(dispatcher, arguments);
    }
};

var stores = {}; // put it into an own namespace

module.exports = {

    create: function (name, storeDescriptor) {
        stores[name] = new Store(storeDescriptor);
        return stores[name];
    },
    getStore: function (name) {
        return stores[name];
    }

};

