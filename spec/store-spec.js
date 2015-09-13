
// @ifndef DIST

var storeFactory = require("../src/store");

describe("store", function () {

    it("should create and return a store named 'myStore", function () {
        storeFactory.create('myStore', { onAction1 : function(){ return "Test";}});

        var store = storeFactory.getStore('myStore');
        expect(store.onAction1).not.toBe(undefined);
        expect(typeof(store.onAction1)).toBe("function");
        expect(store.onAction1()).toBe("Test");

    });

    it("should notify subscriptions", function () {
        var store = storeFactory.create('myStore', { onAction1 : function(){ this.notify({data:"Test"}); }});

        var result = null;
        function callback(data){
            result = data.data;
        }

        store.subscribe(this, callback);
        expect(store.onAction1).not.toBe(undefined);

        store.onAction1();
        expect(result).toBe("Test");

    });

    it("should be able to unsubscribe", function () {
        var store = storeFactory.create('myStore', { onAction1 : function(){ this.notify({data:"Test"}); }});

        var result=null;
        function callback(data){
            result = data.data;
        }

        var subscription = store.subscribe(this, callback);
        subscription.unsubscribe();
        store.onAction1();
        expect(result).toBe(null);

    });

    it("store should be able to subscribe to other store", function () {
        var store1 = storeFactory.create('myStore1', { onAction1 : function(){ this.notify({data:"Store1: Test"}); }});

        var store2 = storeFactory.create('myStore2', {
            onInitialize : function(){
                store1.subscribe(this, this.onStore1Notify);
            },
            onStore1Notify : function(store1Data){ this.notify(store1Data); }
        });

        var result=null;
        function callback(data){
            result = data.data;
        }

        var subscription = store2.subscribe(this, callback);
        store1.onAction1();
        expect(result).toBeDefined();
        expect(result).toBe("Store1: Test");

    });

});

// @endif