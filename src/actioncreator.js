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
