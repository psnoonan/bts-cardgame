import Vue from 'vue';
import Vuex from 'vuex';

import modules from '@/store/modules';
import deckSeed from '@/helpers/deck-seed';

Vue.use(Vuex);

const isProduction = process.env.NODE_ENV !== 'production' ? false : true;

export default new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    modules,
    state: {
        isProduction,
    },
    actions: {
        async INIT({ commit, dispatch }) {
            commit('deck/SET_USED', deckSeed);
            await dispatch('deck/SHUFFLE');
        },
    },
});
