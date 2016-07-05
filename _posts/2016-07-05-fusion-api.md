---
layout: post
section-type: post
title: Nanoflux Fusion API
category: docs
tags: [ 'tutorial' ]
---

## Nanoflux Fusion API Overview

#### [Fusion API](#fusionAPI)
- __[getFusionStore()](#getFusionStore)__
- __[createFusionator(descriptor, namespace?)](#createFusionator)
- __[getFusionActor(actionName, namespace?)](#getFusionActor)

## <a name='fusionAPI'></a> NanoFlux Fusion API

The __nanoflux Fusion__ API *extends* the normal __nanoflux__ API by very few methods only, i.e. you may use __nanoflux__ as usual, 
or even mix both styles (which I do not recommend, as it mixes concepts)  


<a name='getFusionStore'></a>
__`getFusionStore()`__

__nanoflux Fusion__ works with a dedicated single store only. This method returns this store, i.e. a normal *nanoflux* store. 
It is already connected to the default dispatcher, so there`s no need to care about the internals. 

This store has only two public method, which are  

 - `getState()`, which returns the __immutable__ application state.
 - `subscribe()`, which connects components to listen to changes on this store (the same as in *nanoflux*)

<a name='createFusionator'></a>
__`createFusionator( descriptor, namespaces )`__

Creates a Fusionator with optional namespace.
 
The descriptor is a JSON object containing the Fusionators available methods. The method __must__ return a JSON object, which
 is/will be part of the application state. 
 
Each function of a Fusionator has the following signature

{% highlight javascript %}
function(previousState, argumentList)
{% endhighlight %}
 
where *previousState* is the __immutable__ application state, and *argumentList* is an array of arguments passed on the related Actors call.

The optional *namespace* argument can be used when breaking Fusionators in smaller units (important for larger applications). 
They avoid namespace collisions, as it could be cumbersome to invent non-colliding action names :)  

This method does return nothing! 

> Note: The returned object can be of any complexity, as immutability is done recursively. Although, this may have 
impact on runtime performance, it was proven that performance is sufficient even for several thousand states.
  
{% highlight javascript %}
NanoFlux.createFusionator({
	// will be mapped to actor name 'addItem'
	addItem  : function(previousState, args){
		var items = previousState.items || [];  
		var item = args[0];		
		items.push(item);
		return { items: items }
	}
}, 'fooNamespace');
{% endhighlight %}


<a name='getFusionActor'></a>
__`getFusionActor( actorId, namespace? )`__

Returns a function object, i.e. a specific action for a specific Fusionator. Actors are created automatically when a calling [*createFusionator()*](#createFusionator).
The *actorId* is the functions name defined in the Fusionator. Using namespaces helps to avoid naming collisions, when using
multiple Fusionators. If namespace is not given, the default namespace is used.

 
 {% highlight javascript %}
 var fooNS = 'fooNamespace';
 
 NanoFlux.createFusionator({
 	// will be mapped to actor name 'myAction'
 	myAction  : function(previousState, args){
 		return { 
 		    bar: { foo:  "foo"}, 
 		    a: args[0], // {a: 123, b: "text"}
 		    b: args[1] // "2ndArg"
 		}; 
 	}
 }, fooNS);
 
 // get Actor
 var myAction = NanoFlux.getFusionActor('myAction', fooNS);
 
 // call Actor
 myAction({a: 123, b: "text"},"2ndArg");
 {% endhighlight %}
 

    
