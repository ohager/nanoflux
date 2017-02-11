// @ifndef DIST

var dispatcherFactory = require("../src/dispatcher");

describe("Dispatcher Creation", function () {

	beforeEach(function(){
		dispatcherFactory.clear();
	});

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

    it("should create action on dispatch", function () {

        var dispatcher = dispatcherFactory.create('myDispatcher1');
        dispatcher.dispatch('action1');

        expect(typeof(dispatcher.action1)).toBe("function");
    });

	it("should get default dispatcher", function () {
		var dispatcher = dispatcherFactory.getDispatcher();
		expect(dispatcher).toBeDefined();
	});

	it("should get default dispatcher with action array", function () {
		var dispatcher = dispatcherFactory.create(null, ['action1','action2']);
		expect(dispatcher).toBeDefined();
		expect(typeof(dispatcher.action1)).toBe("function");
		expect(typeof(dispatcher.action2)).toBe("function");
	});

});

// @endif