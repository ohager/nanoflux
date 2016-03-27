#!/usr/bin/env node
var PerfTest = require('../perf/perftest');
var Alt = require('../perf/lib/alt.min');

var alt = new Alt();

alt.addActions('actions', {
	action1 : function(data){
		return data;
	},
	action2 : function(data){
		return data;
	}
});

var actions = alt.getActions('actions');

alt.addStore('store', {

	bindListeners: {
		onAction1: actions.action1,
		onAction2: actions.action2
	},

	state: {
		test: {}
	},

	publicMethods: {
		getData: function () {
			return test;
		}
	},

	onAction1: function (data) {
		this.setState({
			test: data
		});

	},

	onAction2: function (data) {
		this.setState({
			test: data
		});
	}
});

module.exports = PerfTest.createPerfTest('alt-perf', {

	actions : alt.getActions('actions'),

   before : function(){
	   alt.getStore('store').listen(function(data){
		   var localData = data;
	   })
   },

    exec : function(i){
		this.actions.action1("test 1." + i);
		this.actions.action2("test 2." + i);
    },

    after : function(){
    }

});

