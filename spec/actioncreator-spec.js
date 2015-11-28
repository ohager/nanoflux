
// @ifndef DIST

var actionCreatorFactory = require("../src/actioncreator");

function DispatcherMockup(){}

DispatcherMockup.prototype.result = undefined;
DispatcherMockup.prototype.dispatch = function(actioname, data){
    this.result = data;
};


describe("Action Creator", function () {

    it("should create and return an action creator named 'myActionCreator", function () {

        actionCreatorFactory.create('myActionCreator', null, {
            action1: function () {
                return "Test";
            }
        });

        var actions = actionCreatorFactory.getActions('myActionCreator');
        expect(actions.action1).not.toBe(undefined);
        expect(typeof(actions.action1)).toBe("function");
        expect(actions.action1()).toBe("Test");

    });

    it("should dispatch for an action", function () {

        var dispatcher = new DispatcherMockup();

        actionCreatorFactory.create('myActionCreator', dispatcher, {
            action1: function (data) {
                this.dispatch('action1', data);
            }
        });

        var actions = actionCreatorFactory.getActions('myActionCreator');
        actions.action1("Test");
        expect(dispatcher.result).toBe("Test");

    });
});

// @endif