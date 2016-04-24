---
layout: post
section-type: post
title: Implementation comparisons
category: docs
tags: [ 'tutorial' ]
---

<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>

<script>

 google.charts.load('current', {'packages':['bar']});
 google.charts.setOnLoadCallback(drawStuff);

  function drawStuff() {
    var data = new google.visualization.arrayToDataTable([
      ['Implementation', 'KiB', 'Ops/Sec'],
      ['Facebook', 2, 163983.67],
      ['NanoFlux', 3.5, 157380],
      ['Reflux', 18, 61861.33],
      ['Alt', 23, 27704.33],
      ['DeLorean', 20, 9350.33]
    ]);

	var width= 800;
	while($(this).outerWidth() < width){
		width = width * (2/3);
	}
	var height = width * (3/4);
	console.log(width + ',' + height);

    var options = {
      width: width,
      height: height,
       chartArea: {
            backgroundColor: 'transparent',
       },
       colors: ['#DEAE26', '#1A7889'],
      chart: {
        title: 'Flux Implementations Quantitative Comparison',
        subtitle: 'Size (minified, not gzipped) on the left, runtime performance on the right (run on Dell XPS15 i7)'
      },
      bars: 'vertical',
      series: {
        0: { axis: 'size' }, 
        1: { axis: 'perf' } 
      },
      axes: {
        x: {
          size: {side: 'left', label: 'kilobytes'},
          perf: {side: 'right', label: 'operations per second'}
        }
      }
    };

  var chart = new google.charts.Bar(document.getElementById('dual_x_div'));
  chart.draw(data, google.charts.Bar.convertOptions(options));
};
</script>

## Comparison to Facebook's Implementation

From an architectural point of view, the main difference is that [Facebook's Flux implementation](https://github.com/facebook/flux) provides 
one central dispatcher, while __nanoflux__ supports also multiple dispatchers (if needed). Given that flexibility, it is possible to link multiple stores 
and multiple dispatchers, but IMHO this would only be a preferable scenario for really large applications. Additionally, it is also possible 
(as a built in feature) to link stores easily, so they can notify each other on changes (chaining).

For more comfort, __nanoflux__ supports a 'fluxy' way, which means, that a dispatcher provides actions directly without the need of a dedicated *ActionProvider*. 
This can be quite handy in less complex applications and reduces much of boilerplate code. Of course, __nanoflux__  supports the original concept with separated *ActionProvider*. 

The verbosity may be one of the 'weakest' aspects of Facebook's Flux: this is due to the fact, that Facebook provides the Dispatcher only, 
 where the mapping has to be established entirely through the implementer, which turns in verbose code. Facebook Flux does not offer any
*Store* and/or an *ActionProvider* helpers, which turns the implementation in a very lightweight one, too; even smaller than __nanoflux__. 
One of the __nanoflux__ features is it's convention based automapping for actions and store functions. In this point __nanoflux__ offers slightly 
less flexibility with its a pure functional approach only - at least regarding the action-dispatcher-store-binding - but is *much* more comfortable. 
On the other hand, the developer gains with Facebook Flux more liberty on implementation decisions. For example, it is left to the developer how 
stores and actions may interoperate, p.e. common approaches base on event emitters. 


## Quantitative Comparison with other implementations

__nanoflux__ is a really tiny and also fast implementation, as the following chart depicts.
Obviously, the reference implementation from Facebook is slightly superior, but as mentioned above it offers *much* less comfort than __nanoflux__.

<div id="dual_x_div" style="width:800px;margin: auto"></div> 

Currently, all performance measuring is done server side using `nodejs`. I think it is slightly slower than Facebooks implementation, 
as __nanoflux__ uses a comfortable auto-binding, without verbose switch-case-statements like the Facebook version. Nevertheless, it should be fast enough :)

