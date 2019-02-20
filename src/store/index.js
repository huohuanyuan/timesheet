import Vue from 'vue';
import Vuex from 'vuex';

import app from "./modules/app";
import timeSheet from "./modules/timeSheet";
import calendar from "./modules/calendar";

// vuex
Vue.use(Vuex);
const store = new Vuex.Store({
    state: {

    },
    mutations: {

    },
    actions: {

    },
    modules: {
        app,
        timeSheet,
        calendar
    }
})

export default store;