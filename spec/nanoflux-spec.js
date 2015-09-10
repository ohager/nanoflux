var NanoFlux = require("../src/nanoflux");

describe("NanoFlux Basics", function () {

    it("should create store 'myStore", function () {
        var store = NanoFlux.createStore('myStore', {
            onAction1 : function(){
                return "Test";
            }
        });
        expect(store.onAction1).not.toBe(undefined);
        expect(typeof(store.onAction1)).toBe("function");
        expect(store.onAction1()).toBe("Test");
    });

    it("should return created store 'myStore", function () {
        NanoFlux.createStore('myStore', {
            onAction1 : function(){
                return "Test";
            }
        });
        var store = NanoFlux.getStore('myStore');
        expect(store.onAction1).not.toBe(undefined);
        expect(typeof(store.onAction1)).toBe("function");
        expect(store.onAction1()).toBe("Test");
    });

});


describe("NanoFlux Dispatching", function () {

    var result = null;
    var store = NanoFlux.createStore('myStore', {
        onAction1 : function(data){
            result = data;
        },
        onAction2 : function(data){
            result = data * 2;
        }
    });

    function ActionProvider(dispatcher){
        this.action1 = function(data){
            dispatcher.dispatch('action1',data);
        };

        this.action2 = function(data){
            dispatcher.dispatch('action2',data);
        };

    }

    it("should dispatch 'static' actions 'action1' and 'action2 (Fluxy)", function () {
        var dispatcher = NanoFlux.createDispatcher('myDispatcher', ['action1','action2']);
        store.connectTo(dispatcher);

        dispatcher.action1("Action1");
        expect(result).toBe("Action1");

        dispatcher.action1("Action1.1");
        expect(result).toBe("Action1.1");

        dispatcher.action2(2);
        expect(result).toBe(4);
    });

    it("should dispatch 'dynamic' actions 'action1' and 'action2 (Full Flux)", function () {
        var dispatcher = NanoFlux.createDispatcher('myDispatcher');
        store.connectTo(dispatcher);
        var actions = new ActionProvider(dispatcher);

        actions.action1("Action1");
        expect(result).toBe("Action1");

        actions.action1("Action1.1");
        expect(result).toBe("Action1.1");

        actions.action2(2);
        expect(result).toBe(4);
    });


    it("should be able to use 'static' and  'dynamic' actions 'action1' and 'action2", function () {
        var dispatcher = NanoFlux.createDispatcher('myDispatcher', 'action1');
        store.connectTo(dispatcher);
        var actions = new ActionProvider(dispatcher);

        dispatcher.action1("Action1");
        expect(result).toBe("Action1");

        actions.action1("Action1.1");
        expect(result).toBe("Action1.1");

        actions.action1("Action1.2");
        expect(result).toBe("Action1.2");

        actions.action2(2);
        expect(result).toBe(4);
    });


});


