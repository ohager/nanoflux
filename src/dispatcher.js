/**
 * Created by oliver on 05/09/2015.
 */
function Subscription(subscriber, arr) {

    var subscriptionList = arr;
    var handle = subscriber;

    this.unsubscribe = function (){
        var index = arr.indexOf(handle);
        subscriptionList.splice(index, 1);
    }
}

function Dispatcher(actions){

    var self = this;
    this.__subscriptionList = [];

    var createActionList = function(actionArray){
        for(var i = 0; i < actionArray.length; ++i){
            var actionName = actionArray[i];
            self[actionName] = function(msg) { console.warn(msg);}.bind(null, "Action " +  actionName + " is not attached to any store yet!");
        }
    };

    var initialize = function(){
        if(actions){
            createActionList(actions);
        }
    };

    initialize();
}

Dispatcher.prototype.getActionNames = function(){

    var actionNames = [];

    for (var actionName in this) {
        if (this.hasOwnProperty(actionName) && actionName.indexOf("__") === -1) {
            actionNames.push(actionName);
        }
    }

    return actionNames;
};

Dispatcher.prototype.subscribe = function(context, func){
    var subscriber = { context : context, func : func };
    this.__subscriptionList.push(subscriber);
    return new Subscription(subscriber, this.__subscriptionList);
};

Dispatcher.prototype.notify = function(){
    for(var i = 0; i < this.__subscriptionList.length; ++i){
        var subscriber = this.__subscriptionList[i];
        subscriber.func.apply(subscriber.context, arguments );
    }
};

module.exports = {
    create : function(name, actionArray){
        return new Dispatcher(name, actionArray);
    }
};
