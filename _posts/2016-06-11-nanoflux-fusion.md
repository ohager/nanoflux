---
layout: post
section-type: post
title: Nanoflux Fusion
category: docs
tags: [ 'tutorial' ]
---

## Nanoflux Fusion 

Nanoflux Fusion is an evolution of Nanoflux that adopts the Redux approach using reducer functions (I call them *Fusionators*) to
 change the state inside the one and only store. 

{% highlight shell %}
    npm install nanoflux-fusion --save    
{% endhighlight %}  
  
## Differences to (Nano)Flux

First of all, using *Fusion* you won't lose any of the original functionality, but you'll gain a very comfortable way to 
deal with application state. While the traditional approach uses Actions, Dispatcher(s) and Stores, the evolved *Fusion* 
reduces the architecture to several Actions, which I call Actors in this case, and a single Store. Although, the Dispatcher 
still exists, the user won't get in touch with it, as it is a hidden implementation detail. The main difference is, 
that there's no need to implement the Store, as the state manipulation is done within the assign/merge/fuse/reduce functions 
(named *Fusionators*), which are handled by the dedicated Fusion store. The *Fusion* interface provides also a special 
action creator, which returns action functions (named *Actors*). 
  
### Fusionators

*Fusionators* are implemented by the user and defines the logic *how* state will change.
A *Fusionator* is a function that receives the previous state and the action arguments and returns the new state. 
Usually, the implementation distinguishes between several action types using if- or switch-statements. While 
this grows proportionally to applications size, it is possible to break the logic in multiple *Fusionators*.

### Actors

Actors are called like normal functions with any kind of parameter. When a Fusionator is created, 
the actors are constructed also and are available via __getFusionActor()__

#### Simple Example

{% highlight javascript %} 
var NanoFlux = require('nanoflux-fusion');

// NanoFlux provides a dedicated store
var fusionStore = NanoFlux.getFusionStore();

// subscription is the same as in NanoFlux, note that the function passes a state (which is immutable)
var subscription = fusionStore.subscribe(this, function(state){
	// ... do something with the state
	// state is also available via fusionStore.getState()
	console.log("Items:", state.items);
});

// the 'fusionator' is responsible for the state manipulation
// it is called with two arguments, the previous state
// and an arguments array containing the arguments passed on actors call.
NanoFlux.createFusionator({
	// the given function name is used as reference for getFusionActor() 
	addItem : function(previousState, args){
		var currentItems = previousState.items ? previousState.items.slice() :[] ;
		currentItems.push(args[0]);
		return { items : currentItems };
	},
	removeItem : function(previousState, args){
		if (!previousState.items || previousState.items.length == 0) return {};

		var items = previousState.items.filter(function (item) {
			return item.name !== args[0].name;
		});
		return {items: items}
	}
});

// gets the fusion actors, i.e. have the same name as defined above
var addItem = NanoFlux.getFusionActor("addItem");
var removeItem = NanoFlux.getFusionActor("removeItem");

// use the actors as simple action functions
addItem({ name: "item1", value : 1 });
addItem({ name: "item2", value : 2 });

removeItem("item1");

       
{% endhighlight %}

### Multiple Fusionators

With the growth of the project a single Fusionator would become quite large, and it could be cumbersome to find adequate actor names.
Fortunately, *Fusion* is capable to support multiple Fusionators. Each Fusionator has its own namespace, avoiding naming conflicts though.

If namespace is not given (good for simpler scenarios) the default namespace is used. 

#### Multiple Fusionator Example

{% highlight javascript %} 
var NanoFlux = require('nanoflux-fusion');
var fusionStore = NanoFlux.getFusionStore();

var subscription = fusionStore.subscribe(this, function(state){
    // ...
});

// the fusionator namespaces
var FooFusionatorNS = "FooFusionator";
var BarFusionatorNS = "BarFusionator";

// Fusionator in FooFusionatorNS namespace
NanoFlux.createFusionator({
	foo : function(previousState, args){
		return { foo : args[0] };
	},
}, FooFusionatorNS); /// <-- NAMESPACE as second argument

// Fusionator in BarFusionatorNS namespace 
NanoFlux.createFusionator({
	// won't conflict with other Fusionator due to namespacing
	foo : function(previousState, args){
		return { foo : args[0] };
	},
}, BarFusionatorNS); /// <-- NAMESPACE as second argument

// gets the fusion actors for different Fusionators
var foo1 = NanoFlux.getFusionActor("foo", FooFusionatorNS); /// <-- NAMESPACE as second argument
var foo2 = NanoFlux.getFusionActor("foo", BarFusionatorNS); /// <-- NAMESPACE as second argument
       
{% endhighlight %}

## Asynchronous Actors

*Fusion* supports asynchronous actions out-of-the-box. If a Fusionator returns a promise instead of a state object,
the promise will be executed, i.e. action is asynchronous. The state shall be passed as argument of the resolver. 
Chaining is also possible. *Fusion* aims to support all [A+ compliant](https://promisesaplus.com/) implementations. 
It is currently tested with the 

 - [native Promise-API](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise/)
 - [Q](https://github.com/kriskowal/q/)
 - [RSVP](https://github.com/tildeio/rsvp.js/)
 - [Bluebird](https://github.com/petkaantonov/bluebird/)
 
### Asynchronous Actor Example
 
```javascript

function asyncA(arg1){
	return new Promise(function(resolve,reject){
		setTimeout(function(){
			// returns state to be merged
			resolve({a: arg1);
		}, 500)
	})
}
 
function asyncB(arg1){
	return new Promise(function(resolve,reject){
		setTimeout(function(){
			var newState = arg1;
			newState.b = 5 + arg1.a;
			resolve(newState);
		}, 500)
	})
}

var asyncFusionator = NanoFlux.createFusionator({
	
	simplePromise: function(prevState, args){
			return asyncA(args[0]); 
	}	
	chainedPromises: function(prevState, args){
		return asyncA(args[0]).then(function(data){
			console.log(data); // data = {a: 5} 
			return asyncB(data);  
		});
	}
});

var simplePromise = NanoFlux.getFusionActor("simplePromise");
var chainedPromises = NanoFlux.getFusionActor("chainedPromises");

// call the actions
simplePromise(5); // state will be { a: 5 }
chainedPromises(5); // state will be { a: 5, b: 10 }

```  

