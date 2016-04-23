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

{% highlight javascript %}
var dispatcher = NanoFlux.getDispatcher();
var myActions = NanoFlux.createActions('myActions', dispatcher, {
	addItem  : function(item){
		// will be mapped to store function 'onAddItem'
		dispatcher.dispatch('addItem', item);		
	},
	loadItems : function(){
		dispatcher.dispatch('loadItems',items);
	}
});
{% endhighlight %}

{% highlight javascript %}
var dispatcher = NanoFlux.getDispatcher(null, ['addItem','loadItems']);
{% endhighlight %}
