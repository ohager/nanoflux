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

