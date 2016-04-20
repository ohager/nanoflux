# nanoflux


__nanoflux__ is a *very* lightweight (about 3.5 KiB minified, and 1.25 KiB gzipped) dependency-free Flux implementation.

The idea of this implementation is to support a very small, but full Flux implementation (separated Action, Dispatcher, and Store), 
and also a "fluxy" version, with Action and Dispatcher merged in one unit. 

Furthermore, __nanoflux__ uses a pure functional approach as a performant solution.

# Features

- Extremely tiny implementation
- No dependencies at all
- Pure Functional approach (totally event less)
- Support for full Flux using full stack of ActionProvider/Creator, Dispatcher, and Stores
- Support for a simplified 'fluxy' concept, where Dispatcher is also ActionProvider
- No singleton
- Interoperable Stores
- Multiple Dispatchers
- Built in ActionCreator (*new*)
- Quite fast (*recently optimized*)
- CommonJS, RequireJS ready


# Comparison to Facebook's Implementation

From an architectural point of view, the main difference is that [Facebook's Flux implementation](https://github.com/facebook/flux) provides 
one central dispatcher, while __nanoflux__ supports also multiple dispatchers (if needed). Given that flexibility, it is possible to link multiple stores 
and multiple dispatchers, but IMHO this would only be a preferable scenario for really large applications. Additionally, it is also possible 
(as a built in feature) to link stores easily, so they can notify each other on changes (chaining).

For more comfort, __nanoflux__ supports a 'fluxy' way, which means, that a dispatcher provides actions directly without the need of a dedicated *ActionProvider*. 
This can be quite handy in less complex applications and reduces much of boilerplate code. Of course, __nanoflux__  supports the original concept with separated *ActionProvider*. 

The verbosity may be one of the 'weakest' aspects of Facebook's Flux: this is due to the fact, that Facebook provides the Dispatcher only. 
A *Store* and/or an *ActionProvider* is not part of their library, and therefore Facebook's Flux implementation is very lightweight, too. 
And even a bit smaller than __nanoflux__. The developer gains more liberty on implementation decisions, but for the costs of more work. 
For example, it is left to the developer how stores and actions may interoperate, p.e. common approaches base on event emitters. 

In this point __nanoflux__ offers slightly less flexibility with its a pure functional approach only - at least regarding 
the dispatcher-store-binding - but is more comfortable. 
 
# Size
__nanoflux__ is a really tiny implementation, although it offers *much* more comfort than the reference implementation from Facebook.

1. fb.flux.min.js       ca. 2 KiB 
2. nanoflux.min.js      ca. 3.5 KiB 
3. reflux.min.js        ca. 18 KiB 
4. delorean.min.js      ca 20 KiB
5. alt.min.js           ca 23 KiB

# Performance

__nanoflux__  use synchronous function calls, that makes __nanoflux__ quite fast. Synchronous cycles guarantee consistent dispatch cycles.

Here are some results of benchmarks for entire *action-dispatch-notify*-cycles:

1. fbflux-perf: 163983.67 op/s (0.00 op/s) - 100.00%
2. nanoflux-fluxy-perf: 157380.00 op/s (-6603.67 op/s) - 95.97%
3. nanoflux-fullflux-perf: 151334.33 op/s (-12649.34 op/s) - 92.29%
4. reflux-perf: 61861.33 op/s (-102122.34 op/s) - 37.72%
5. alt-perf: 27704.33 op/s (-136279.34 op/s) - 16.89%
6. delorean-perf: 9350.33 op/s (-154633.34 op/s) - 5.70%

The benchmark code is available under `./perf`.

Currently, all measuring is done server side using `nodejs` (listed results run on Dell XPS15 i7). 
I think it is slightly slower than Facebooks implementation, as __nanoflux__ uses a comfortable auto-binding, 
without verbose switch-case-statements like the Facebook version. Nevertheless, it should be fast enough :)

# Example

The following example demonstrates the 'full' Flux approach, using ActionProvider, Dispatcher, and Store

```javascript

	var NanoFlux = require('nanoflux'); // UMD with browserify!

    var setup = function() {
    
        // Creating a store 'myStore' with functions triggered by dispatched actions
        // The convention for action handlers name is: on<ActionName>
        NanoFlux.createStore('myStore', {
    
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

		// Creating the Dispatcher
		// You may also use the implicit default dispatcher: 
		// var dispatcher = NanoFlux.getDispatcher();
        var dispatcher = NanoFlux.createDispatcher('myDispatcher');
        
        // The full flux concept foresees a separation of actions and dispatcher
        // Here we create actions using the built in action creator
        NanoFlux.createActions('myActions', dispatcher, {
            action1 : function(data){
                console.log("Action 1");
                // this way, the dispatcher establishes dynamically the action binding, calling stores onAction1().
                this.dispatch('action1', data);
            },
    
            action2 : function(data){
                console.log("Action 2");
                this.dispatch('action2', data);
            }
        });    
    };
```
    
    
```javascript
    
    setup();
    function Component(){
    
        // callback called by Store.notify
        this.onNotify = function(data){
            console.log("Component notified: " + JSON.stringify(data));
        };
    
        this.exec = function(){
    
                
            var dispatcher = NanoFlux.getDispatcher('myDispatcher');
            var store = NanoFlux.getStore('myStore');
            var actions = NanoFlux.getActions('myActions'); 
            
            // Now, connecting Store and Dispatcher
            dispatcher.connectTo(store);
            
            // establishes the link between store's notification mechanism and this component.
            // use the returned object to unsubscribe, if needed!
            var subscription = store.subscribe(this, this.onNotify);
    
			// executing the actions    
            actions.action1("test 1");
            actions.action2("test 2");
        };
    }   
```

# Getting nanoflux

You may pick the library directly from ``./dist``, use ``npm install nanoflux``, or use ``bower install nanoflux``

# Build your own

1. Get sources: ``npm install nanoflux`` (or fork/clone this repo)
2. Install dependencies: ``npm install``
3. Build:
  - ``gulp`` to build the minified and non-minified bundle in ``.\dist``

Pronto!

## Automated Testing

The gulp build chain runs tests only for the browserified __nanoflux__ module. 

All tests can be run using `jasmine-node` or `npm run test`. 


# Available Node Tasks

Use `npm run <task>` to execute additional task. Available tasks are:
 
- test : Runs all tests
- benchmark : Runs a performance benchmark for different Flux Implementations. 

# TO DO

- Exhaustive Field-Testing
- More Performance Benchmarks
- Client side Benchmarks
- Neat diagrams for benchmark results

