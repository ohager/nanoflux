var nanofluxDir;

// @ifdef DIST
nanofluxDir = "../dist/nanoflux";
// @endif

// @ifndef DIST
nanofluxDir = "../src/nanoflux";
// @endif

var NanoFlux = require(nanofluxDir);

describe("NanoFlux Basics", function () {

	beforeEach(function(){
		NanoFlux.reset();
	});
	
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
	
	function ActionProvider(dispatcher){
		this.action1 = function(data){
			dispatcher.dispatch('action1',data);
		};

		this.action2 = function(data){
			dispatcher.dispatch('action2',data);
		};

		this.action3 = function(data){
			dispatcher.dispatch('action3',data);
		};
	}

	var storeDescriptor = {
		onAction1 : function(data){
			result = data;
		},
		onAction2 : function(data){
			result = data * 2;
		}
	};

	beforeEach( function(){
		result = null;
		NanoFlux.reset();
	});
	
	it("should dispatch 'static' actions 'action1' and 'action2 (Fluxy)", function () {
		var dispatcher = NanoFlux.createDispatcher('myDispatcher', ['action1','action2']);
		var store = NanoFlux.createStore('myStore',storeDescriptor);

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
		var store = NanoFlux.createStore('myStore',storeDescriptor);
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
		var store = NanoFlux.createStore('myStore',storeDescriptor);
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

	
	it("must not allow to dispatch while dispatch, i.e. call actions in store callbacks", function(){
		var dispatcher = NanoFlux.createDispatcher('myDispatcher');
		var store = NanoFlux.createStore('myStore',storeDescriptor);
		var actions = new ActionProvider(dispatcher);

		store.onAction3 = function(data){
			this.notify(data);
		};

		store.subscribe(this, function(){
			actions.action2("not allowed");
		});

		dispatcher.connectTo(store);

		expect(actions.action3).toThrow();
	})
});

describe("NanoFlux Complex Full Flux Dispatching", function () {

    var store1Descriptor = {
        onAction1 : function(data){
            this.notify({store: 'store1', data: data});
        },
        onAction2 : function(data){
            this.notify({store: 'store1', data: data * 2});
        }
    };

    var store2Descriptor = {
        onAction1 : function(data){
            this.notify({store: 'store2', data: data});
        },
        onAction2 : function(data){
            this.notify({store: 'store2', data: data * 2});
        },
        onAction3 : function(data){
            this.notify({store: 'store2', data: data});
        }
    };
    
    function ActionProvider(dispatcher){
        this.action1 = function(data){
            dispatcher.dispatch('action1',data);
        };

        this.action2 = function(data){
            dispatcher.dispatch('action2',data);
        };

        this.action3 = function(data){
            dispatcher.dispatch('action3',data);
        };
    }

	beforeEach(function(){
		NanoFlux.reset();
	});

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
		var store1 = NanoFlux.createStore('store1',store1Descriptor);
		var store2 = NanoFlux.createStore('store2',store2Descriptor);

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

        actions.action3("Action3");
        expect(resultStore1.store).toBe("store1");
        expect(resultStore1.data).toBe("Action2"); // not changed!
        expect(resultStore2.store).toBe("store2");
        expect(resultStore2.data).toBe("Action3"); // changed!

    });


    it("use multiple dispatchers and single stores", function () {

        var resultStore1 = {};
        this.onNotifyStore1 = function(data){
            resultStore1 = data;
        };

        var dispatcher1 = NanoFlux.createDispatcher('myDispatcher1');
        var dispatcher2 = NanoFlux.createDispatcher('myDispatcher2');

        var actions1 = new ActionProvider(dispatcher1);
        var actions2 = new ActionProvider(dispatcher2);

		var store1 = NanoFlux.createStore('store1',store1Descriptor);

        dispatcher1.connectTo(store1);
        dispatcher2.connectTo(store1);
        store1.subscribe(this, this.onNotifyStore1);

        actions1.action1("Action1.1");
        expect(resultStore1.store).toBe("store1");
        expect(resultStore1.data).toBe("Action1.1");

        actions2.action1("Action1.2");
        expect(resultStore1.store).toBe("store1");
        expect(resultStore1.data).toBe("Action1.2");

    });

    it("use multiple dispatchers and multiple stores", function () {

        var resultStore1 = {};
        this.onNotifyStore1 = function(data){
            resultStore1 = data;
        };

        var resultStore2 = {};
        this.onNotifyStore2 = function(data){
            resultStore2 = data;
        };

        var dispatcher1 = NanoFlux.createDispatcher('myDispatcher1');
        var dispatcher2 = NanoFlux.createDispatcher('myDispatcher2');

        var actions1 = new ActionProvider(dispatcher1);
        var actions2 = new ActionProvider(dispatcher2);

		var store1 = NanoFlux.createStore('store1',store1Descriptor);
		var store2 = NanoFlux.createStore('store2',store2Descriptor);

        dispatcher1.connectTo([store1,store2]);
        dispatcher2.connectTo([store1,store2]);
        store1.subscribe(this, this.onNotifyStore1);
        store2.subscribe(this, this.onNotifyStore2);

        actions1.action1("Action1.1");
        expect(resultStore1.store).toBe("store1");
        expect(resultStore1.data).toBe("Action1.1");
        expect(resultStore2.store).toBe("store2");
        expect(resultStore2.data).toBe("Action1.1");

        actions2.action1("Action1.2");
        expect(resultStore1.store).toBe("store1");
        expect(resultStore1.data).toBe("Action1.2");
        expect(resultStore2.store).toBe("store2");
        expect(resultStore2.data).toBe("Action1.2");

    });
    
});


describe("NanoFlux Advanced Techniques", function () {

	beforeEach(function(){
		NanoFlux.reset();
	});

    it("store should connect to another store", function () {
        var dispatcher = NanoFlux.createDispatcher('myDispatcher', ['action1']);
        var store1 = NanoFlux.createStore('myStore1', {
            onAction1 : function() {
                this.notify("From Store1");
            }
        });
        var store2 = NanoFlux.createStore('myStore2', {
            onInitialize : function(){
                store1.subscribe(this, this.onStore1Notify);
            },
            onStore1Notify : function(data){
                this.notify(data);
            }
        });

        var result;
        dispatcher.connectTo(store1);
        store2.subscribe(this,function(data){
            result = data;
        });

        dispatcher.action1();

        expect(result).toBeDefined();
        expect(result).toBe("From Store1");
    });

});
