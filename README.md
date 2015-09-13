# nanoflux

__nanoflux__ is a *very* lightweight (less than 3 KiB!) and dependency-free Flux implementation.

The idea of this implementation is to support a very small, but full Flux implementation (separated Action, Dispatcher, and Store), 
and also a "fluxy" version, with Action and Dispatcher merged in one unit. 

Furthermore, __nanoflux__ does not use events for communication, but a functional approach for (hopefully) more performant solution (Tests will be made).

# Features

- Extremely tiny implementation (less than 3 KiB)
- No dependencies at all
- Pure Functional approach (totally event less)
- Support for full Flux using full stack of ActionProvider/Creator, Dispatcher, and Stores
- Support for a simplified 'fluxy' concept, where Dispatcher is also ActionProvider
- Interoperable Stores
- Apparently very fast (Performance comparisons in progress)


# Performance

__nanoflux__ neither supports asynchronous action handling, nor any kind of event triggering.
Everything is done using synchronous function calls, that makes __nanoflux__ quite fast.

I think special asynchronous support is not necessary, because long term operations like server requests can be easily
implemented in a stores logic, and change notification is under full control of the programmer.

Notification callbacks in view components should be simple operations (like copying data). Usually, 
the update mechanisms of component based approaches (p.e. like in React) realize their updates in 'separate' render
cycles, and therefore do not affect notification cycles.

Here are some results of benchmarks for entire *action-dispatch-notify*-cycles:

1. nanoflux-fluxy-perf: 42488.67 op/s (0.00 op/s) - 100.00%
2. nanoflux-fullflux-perf: 41404.00 op/s (-1084.67 op/s) - 97.45%
3. reflux-perf: 18490.00 op/s (-23998.67 op/s) - 43.52%
4. delorean-perf: 2403.00 op/s (-40085.67 op/s) - 5.66%


The benchmark code is available under `./perf`.

# Example

The following example demonstrates the 'full' Flux approach, using ActionProvider, Dispatcher, and Store

```javascript

	var NanoFlux = require('nanoflux'); // UMD with browserify!

	// Creating the store
    var myStore = NanoFlux.createStore('myStore', {    
        // the handlers signature bases on the users convention
        onAction1: function (test) {
            console.log("Store.onAction1: " + test);
            // this will call the subscribed callbacks
            this.notify({data: test});
        },

        onAction2: function (test) {
            console.log("Store.onAction2: " + test);
            this.notify({data: test});
        },

        onAction3: function (test) {
            console.log("Store.onAction3: " + test);
            this.notify({data: test});
        }
    });
```
    
```javascript

    // The full flux concept foresees a separation of actions and dispatcher
    // Here we create an action provider using the more dynamic Dispatcher.dispatch method.
    function ActionProvider(dispatcher){
    
        this.action1 = function(data){
            console.log("Action 1");
            // this way, the dispatcher establishes dynamically the action binding
            // to connected stores.
            dispatcher.dispatch('action1', data);
        };
    
        this.action2 = function(data){
            console.log("Action 2");
            dispatcher.dispatch('action2', data);
        }
    }
    
```
    
```javascript
    
    function Component(){
    
        // callback called by Store.notify
        this.onNotify = function(data){
            console.log("Component notified: " + JSON.stringify(data));
        };
    
        this.exec = function(){
    
            // note, that in this example the dispatcher won't be created with any actions.
            // the actions are provided by the dedicated ActionProvider    
            var dispatcher = NanoFlux.createDispatcher('myDispatcher');
            var store = NanoFlux.getStore('myStore');
            
            // Now, connecting Store and Dispatcher
            dispatcher.connectTo(store);
            
            // establishes the link between store's notification mechanism and this component.
            // use the returned object to unsubscribe, if needed!
            var subscription = store.subscribe(this, this.onNotify);
    
            // the 'full flux' way uses a separated ActionProvider
            var actions = new ActionProvider(dispatcher);
    
            actions.action1("test 1");
            actions.action2("test 2");
        };
    }
    
```

# Getting nanoflux

You may pick the library directly from ``./dist``, or build on your own:

__Prerequisite__: NPM installed

Clone the repository and simply run ``npm install``.

After all (dev) dependencies were installed just run ``gulp``.

Pronto!

## Automated Testing

The gulp build chain runs tests only for the browserified nanoflux module. All tests can be run using `jasmine-node` or `npm run test`. 


# Available Node Tasks

Use `npm run <task>` to execute additional task. Available tasks are:
 
- test : Runs all tests
- benchmark : Runs a performance benchmark for different Flux Implementations. 

# TO DO

- Exhaustive Testing
- More Performance Benchmarks
