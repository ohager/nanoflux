---
layout: post
section-type: post
title: Getting Started
category: docs
tags: [ 'tutorial' ]
---

## Installation 

Pull the package in your project's directory using either `npm`, or `bower`:

{% highlight shell %}
    npm install nanoflux --save
    bower install nanoflux
{% endhighlight %}  
  
## Usage
Once included in your project you need to define your stores, and wire them with your dispatcher(s):
  
{% highlight javascript %} 
var NanoFlux = require('nanoflux');
       
// the 'fluxy' version creates actions directly in dispatcher, which reduces verbosity
// the dispatcher can be fetched using NanoFlux.getDispatcher([dispatcherName]);
var dispatcher = NanoFlux.createDispatcher('dispatcher', ['loadProducts', 'addProduct']);

// wire store with current dispatcher     
// usually, you would describe your store in separate file
dispatcher.connectTo( NanoFlux.createStore('shopStore', {        
        _products : null,
    
        getProducts : function(){ return this._products; }, // returns immutable
    
        // automatically mapped using the convention on + [ActionName]
        onLoadProducts : function(){
            // calling an asynchronous function
            shopService.loadProducts().then( (products) => {
                this._products = Immutable(products); // using immutable pattern here
                this.notify(); // notifies all subscribed views
            });
        },                
        // automatically mapped using the convention on + [ActionName]
        onAddProduct : function(product){
			this._products = this._products.concat(Immutable(product));
            this.notify();
        },     
    }) 
);
// setting NanoFlux globally omits the need of further imports throughout your app
window.NanoFlux = NanoFlux;
{% endhighlight %}

Here's how you may use it in your views:

{% highlight javascript %}   
var ProductContainer = React.createClass({

	// get actions and store
    actions : NanoFlux.getDispatcher('dispatcher'),
    shopStore : NanoFlux.getStore('shopStore'),

    getInitialState : function(){
        return { subscription : null, products : [] }
    },

	// the callback from shopStore
    onShopUpdated : function(){
        this.setState({ products : this.shopStore.getProducts() });
    },
    
    componentWillMount : function(){
        // start listening to store when view is mounted
        // passing calling context 'this' and the callback function
        this.state.subscription = this.shopStore.subscribe(this, this.onShopUpdated);
        this.actions.loadProducts();
    },
    
    componentWillUnmount : function(){
        // unsubscribe
        this.subscription.unsubscribe();
    },

    render(){
        return (
            // ... your render stuff
        )
    }
});
{% endhighlight %}