---
layout: post
section-type: post
title: Getting Started
category: docs
tags: [ 'tutorial' ]
---

## Nanoflux Fusion 

Nanoflux Fusion is an extension that adopts the Redux approach using reducer functions (I call them *Fusionators*) to
 change the state inside the one and only store. 

{% highlight shell %}
    npm install nanoflux-fusion --save    
{% endhighlight %}  
  
## Differences to (Nano)Flux

First of all, using *Fusion* you won't loose any of the original functionality, but you'll gain a very comfortable way to 
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

{% highlight javascript %} 
var NanoFlux = require('nanoflux-fusion');
       
// todo example       
       
{% endhighlight %}

### Actors

TO DO