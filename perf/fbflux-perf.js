#!/usr/bin/env node
var EventEmitter = require('events').EventEmitter;
var assign = require('../node_modules/object-assign');
var PerfTest = require('../perf/perftest');
var Dispatcher = require('../perf/lib/fb.flux.min').Dispatcher;

var dispatcher = new Dispatcher();

var ACTION1_ID = 'action1';
var ACTION2_ID = 'action2';
var CHANGE_EVENT = 'change-event';

var actions = {

    action1: function (data) {
        dispatcher.dispatch({
            actionType: ACTION1_ID,
            data: data
        });
    },

    action2: function (data) {
        dispatcher.dispatch({
            actionType: ACTION2_ID,
            data: data
        });
    }
};

var store = assign({}, EventEmitter.prototype, {

    onAction1: function(data) {
        this.emit(CHANGE_EVENT, data);
    },
    onAction2: function(data) {
        this.emit(CHANGE_EVENT, data);
    },
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    }
});


dispatcher.register(function(action) {
    switch (action.actionType) {
        case ACTION1_ID:
            store.onAction1(action.data);
            break;
        case ACTION2_ID:
            store.onAction2(action.data);
            break;
    }
});

module.exports = PerfTest.createPerfTest('fbflux-perf', {

    before: function () {
        store.addChangeListener(function(data){
            var localData = data;
        });
    },

    exec: function (i) {
        actions.action1("test 1." + i);
        actions.action2("test 2." + i);
    },

    after: function () {
    }

});

