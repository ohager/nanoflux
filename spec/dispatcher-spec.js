// @ifndef DIST

var dispatcherFactory = require("../src/dispatcher");
var storeFactory = require("../src/store");

describe("Dispatcher Creation", function () {

    it("should create multiple actions 'action1' and 'action2", function () {
        var dispatcher = dispatcherFactory.create('myDispatcher', ['action1','action2']);
        expect(dispatcher.action1).toBeDefined();
        expect(dispatcher.action2).toBeDefined();
        expect(typeof(dispatcher.action1)).toBe("function");
        expect(typeof(dispatcher.action2)).toBe("function");
    });

    it("should create a single actions 'action1'", function () {
        var dispatcher = dispatcherFactory.create('myDispatcher1', 'action1');
        expect(dispatcher.action1).toBeDefined();
        expect(typeof(dispatcher.action1)).toBe("function");
    });

    it("should return the created dispatcher 'myDispatcher'", function () {
        dispatcherFactory.create('myDispatcher1', 'action1');
        var dispatcher = dispatcherFactory.getDispatcher('myDispatcher1');
        expect(dispatcher).toBeDefined();
        expect(typeof(dispatcher.action1)).toBe("function");
    });


    it("can create without any action", function () {
        var dispatcher = dispatcherFactory.create('myDispatcher1');
        expect(dispatcher).toBeDefined();
    });

});

// @endif