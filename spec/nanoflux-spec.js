var NanoFlux = require("../src/nanoflux");

describe("NanoFlux", function () {

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

