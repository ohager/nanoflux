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
        // TODO: 1-to-1 relation needs to be 1-to-n relation
        // dispatcher[actionName].push(self[handlerName].bind(this));
        dispatcher[actionName] = self[handlerName].bind(this);
    }
};

Store.prototype.connectTo = function (dispatcherArray) {

    if (!Array.isArray(dispatcherArray)) {
        dispatcherArray = [dispatcherArray];
    }

    for (var i = 0; i < dispatcherArray.length; ++i) {

        var dispatcher = dispatcherArray[i];
        dispatcher.__connectStore(this);

        var actionNames = dispatcher.getActionNames();
        for (var j = 0; j < actionNames.length; ++j) {
            this.__bindAction(dispatcher, actionNames[j]);

        }
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

