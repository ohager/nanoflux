var dispatcherFactory = require("../src/dispatcher");

describe("dispatcher", function () {
    it("should create actions 'action1' and 'action2", function () {
        var dispatcher = dispatcherFactory.create('myDispatcher', ['action1','action2']);
        expect(dispatcher.action1).not.toBe(undefined);
        expect(dispatcher.action2).not.toBe(undefined);
        expect(typeof(dispatcher.action1)).toBe("function");
        expect(typeof(dispatcher.action2)).toBe("function");
    });
});
