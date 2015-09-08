/**
 * Created by oliver on 05/09/2015.
 */
function Store(descriptor) {

    this.__connectedDispatchers = [];
    var storeDescriptor = descriptor;

    var generateHandlerName = function (actionName) {
        return "on" + actionName[0].toUpperCase() + actionName.substr(1);
    };

    this.connectTo = function (dispatcherArray) {

        if (!Array.isArray(dispatcherArray)) {
            dispatcherArray = [dispatcherArray];
        }

        for (var i = 0; i < dispatcherArray.length; ++i) {

            var dispatcher = dispatcherArray[i];
            var actionNames = dispatcher.getActionNames();

            for (var j = 0; j < actionNames.length; ++j) {
                var actionName = actionNames[j];
                var handlerName = generateHandlerName(actionName);
                if (storeDescriptor[handlerName]) {
                    dispatcher[actionName] = storeDescriptor[handlerName].bind(this);
                }
                else {
                    console.warn("Function '" + handlerName + "' not defined in this stores definition");
                }
            }
        }
        this.__connectedDispatchers = dispatcherArray;
    };
}

Store.prototype.notify = function () {
    var dispatchers = this.__connectedDispatchers;
    for (var i = 0; i < dispatchers.length; ++i) {
        var dispatcher = dispatchers[i];
        dispatcher.notify.apply(dispatcher, arguments);
    }
};

module.exports = {

    create: function (name, storeDescriptor) {
        return new Store(name, storeDescriptor);
    }

};

