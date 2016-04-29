---
layout: post
section-type: post
title: Full Flux vs Fluxy
category: docs
tags: [ 'tutorial' ]
---

# Full Flux vs Fluxy

Many times, the action function is nothing more than a simple dispatch call. To reduce boilerplate you can use the fluxy way.
The following examples are analogue. The difference is, that in the fluxy version you call the actions directly from the dispatcher.

#### Full Flux
{% highlight javascript %}
var myActions = NanoFlux.createActions('myActions', NanoFlux.getDispatcher(), {
	addItem  : function(item){
		this.dispatch('addItem', item);		
	},
	loadItems : function(){
		this.dispatch('loadItems');
	}
});

// usage 
myActions.addItem( item );
myActions.loadItems();
{% endhighlight %}


#### Fluxy
{% highlight javascript %}
var dispatcher = NanoFlux.getDispatcher(null, ['addItem','loadItems']);

//usage
dispatcher.addItem( item );
dispatcher.loadItems();
{% endhighlight %}


Although, you may use both approaches together, the Action Provider won't be extended by the dispatchers actions. 
Maybe in the future there'll be support for it. 
