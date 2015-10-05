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
- No singleton
- Interoperable Stores
- Multiple Dispatchers
- Quite fast
- CommonJS, RequireJS ready



# Comparison to Facebook's Implementation

From an architectural point of view, the main difference is that [Facebook's Flux implementation](https://github.com/facebook/flux) provides 
one central dispatcher, while __nanoflux__ supports also multiple dispatchers (if needed). Given that flexibility, it is possible to link multiple stores 
and multiple dispatchers, but I hardly doubt that this is a preferable scenario, as this can get quite messy. Nevertheless, it is also possible 
(as a built in feature) to link stores easily, so they can notify each other on changes.
For the sake of simplicity, __nanoflux__ supports a 'fluxy' way, which means, that a dispatcher provides actions directly. This can be quite handy in less 
complex applications and reduces much of boilerplate code. Of course, __nanoflux__  supports the original concept with separated *ActionProvider*. 
The verbosity may be one of the 'weakest' aspects of Facebook's Flux: this is due to the fact, that Facebook provides the Dispatcher only. 
A *Store* and/or an *ActionProvider* is not part of their library, and therefore Facebook's Flux implementation is very lightweight, too. 
And even a bit smaller than __nanoflux__.  The developer gains more liberty on implementation decisions, but for the costs of more work. 
For example, it is left to the developer how stores and actions may interoperate, p.e. common approaches base on event emitters. 
In this point __nanoflux__ offers slightly less flexibility with its a pure functional approach only - at least regarding 
the dispatcher-store-binding - but is more comfortable. 
 

# Performance

__nanoflux__ neither supports asynchronous action handling, nor any kind of event triggering.
Everything is done using synchronous function calls, that makes __nanoflux__ quite fast.

I think special asynchronous support is not necessary, because long term operations like server requests can be easily
implemented in a stores logic, and change notification is under full control of the programmer.

Here are some results of benchmarks for entire *action-dispatch-notify*-cycles:

1. fbflux-perf: 50461.33 op/s (0.00 op/s) - 100.00%
2. nanoflux-fluxy-perf: 42936.00 op/s (-7525.33 op/s) - 85.09%
3. nanoflux-fullflux-perf: 42455.00 op/s (-8006.33 op/s) - 84.13%
4. reflux-perf: 18585.67 op/s (-31875.66 op/s) - 36.83%
5. delorean-perf: 2376.00 op/s (-48085.33 op/s) - 4.71%

The benchmark code is available under `./perf`.

Currently, all measuring is done server side using `nodejs`. No client side performance tests were done yet.
Interestingly, Facebook's Flux is the fastest implementation (of all tested ones). I expected the functional approach to be faster than events. 
I think `nodejs`s native event emitter is highly optimized, as it is the core of nodejs. Maybe on client side it won't be that fast, but I have to test it.  

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
