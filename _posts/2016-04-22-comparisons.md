---
layout: post
section-type: post
title: Implementation comparisons
category: docs
tags: [ 'tutorial' ]
---

## Comparison to Facebook's Implementation

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
 
## Size
__nanoflux__ is a really tiny implementation, although it offers *much* more comfort than the reference implementation from Facebook.

| Implementation   | Size |
|:-----------------|:-----------:|
|fb.flux.min.js|~2 KiB| 
|nanoflux.min.js|~3.5 KiB| 
|reflux.min.js|~18 KiB| 
|delorean.min.js|~20 KiB|
|alt.min.js|~23 KiB|


## Performance

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

