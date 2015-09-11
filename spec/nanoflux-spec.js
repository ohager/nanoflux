var nanofluxDir;

// @ifdef DIST
nanofluxDir = "../dist/nanoflux";
// @endif

// @ifndef DIST
nanofluxDir = "../src/nanoflux";
// @endif

var NanoFlux = require(nanofluxDir);

describe("NanoFlux Basics", function () {

    it("should create store 'myStore", function () {
        var store = NanoFlux.createStore('myStore', {
            onAction1 : function(){
                return "Test";
            }
        });
        expect(store.onAction1).toBeDefined();
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
        expect(store.onAction1).toBeDefined();
        expect(typeof(store.onAction1)).toBe("function");
        expect(store.onAction1()).toBe("Test");
    });

    it("should create dispatcher 'myDispatcher", function () {
        var dispatcher = NanoFlux.createDispatcher('myDispatcher',['action1', 'action2']);
        expect(dispatcher.action1).toBeDefined();
        expect(typeof(dispatcher.action1)).toBe("function");
    });

    it("should return created dispatcher 'myDispatcher", function () {
        NanoFlux.createDispatcher('myDispatcher',['action1', 'action2']);
        NanoFlux.createDispatcher('myDispatcher1','action3');
        var dispatcher = NanoFlux.getDispatcher('myDispatcher');

        expect(dispatcher.action1).toBeDefined();
        expect(typeof(dispatcher.action1)).toBe("function");
        expect(dispatcher.action3).not.toBeDefined();
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
        dispatcher.connectTo(store);

        dispatcher.action1("Action1");
        expect(result).toBe("Action1");

        dispatcher.action1("Action1.1");
        expect(result).toBe("Action1.1");

        dispatcher.action2(2);
        expect(result).toBe(4);
    });

    it("should dispatch 'dynamic' actions 'action1' and 'action2 (Full Flux)", function () {
        var dispatcher = NanoFlux.createDispatcher('myDispatcher');
        dispatcher.connectTo(store);
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
        dispatcher.connectTo(store);
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

describe("NanoFlux Complex Full Flux Dispatching", function () {

    var store1 = NanoFlux.createStore('store1', {
        onAction1 : function(data){
            this.notify({store: 'store1', data: data});
        },
        onAction2 : function(data){
            this.notify({store: 'store1', data: data * 2});
        }
    });

    var store2 = NanoFlux.createStore('store2', {
        onAction1 : function(data){
            this.notify({store: 'store2', data: data});
        },
        onAction2 : function(data){
            this.notify({store: 'store2', data: data * 2});
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


    it("use single dispatcher and multiple stores", function () {

        var resultStore1 = {};
        this.onNotifyStore1 = function(data){
            resultStore1 = data;
        };

        var resultStore2 = {};
        this.onNotifyStore2 = function(data){
            resultStore2 = data;
        };

        var dispatcher = NanoFlux.createDispatcher('myDispatcher');
        var actions = new ActionProvider(dispatcher);

        dispatcher.connectTo([store1,store2]);
        store1.subscribe(this, this.onNotifyStore1);
        store2.subscribe(this, this.onNotifyStore2);

        actions.action1("Action1");
        expect(resultStore1.store).toBe("store1");
        expect(resultStore1.data).toBe("Action1");
        expect(resultStore2.store).toBe("store2");
        expect(resultStore2.data).toBe("Action1");

        actions.action1("Action2");
        expect(resultStore1.store).toBe("store1");
        expect(resultStore1.data).toBe("Action2");
        expect(resultStore2.store).toBe("store2");
        expect(resultStore2.data).toBe("Action2");

    });
    
});



