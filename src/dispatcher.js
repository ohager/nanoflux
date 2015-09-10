
function Dispatcher(actions) {

    var self = this;
    this.__subscriptionList = [];
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

Dispatcher.prototype.__registerAction = function (actionName) {

    var self = this;

    if(self[actionName]) return;

    self[actionName] = function (msg) {
        console.warn(msg);
    }.bind(null, "Action " + actionName + " is not attached to any store yet!");

};

Dispatcher.prototype.__connectStore = function (store) {
    if(this.__connectedStores.indexOf(store)===-1){
        this.__connectedStores.push(store);
    }
};

Dispatcher.prototype.__bindAction = function(actionName){
    for (var i = 0; i < this.__connectedStores; ++i) {
        var store = this.__connectedStores[i];
        store.__bindAction(actionName);
        this.__connectStore(store);
    }
};


Dispatcher.prototype.getActionNames = function () {

    var actionNames = [];

    for (var actionName in this) {
        if (this.hasOwnProperty(actionName) && actionName.indexOf("__") === -1) {
            actionNames.push(actionName);
        }
    }

    return actionNames;
};





Dispatcher.prototype.dispatch = function (actionName, data) {
    var self = this;
    self.__registerAction(actionName);
    self.__bindAction(actionName);
    self[actionName](data);
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
