export const state = {
    shuffleLimit: 5,
    live: [],
    used: [],
};

export const mutations = {
    SET_LIVE(state, cardsArray) {
        state.live = cardsArray;
    },
    SET_USED(state, cardsArray) {
        state.used = cardsArray;
    },
    PUSH_TO_USED(state, card) {
        state.used.push(card);
    },
};

export const actions = {
    // randomly shuffles used deck and moves to end of live deck
    async SHUFFLE({ state, commit }) {
        return new Promise(resolve => {
            const live = [...state.live];
            const used = [...state.used];
            for (let i = used.length - 1; i > 0; i--) {
                // Set j to random index from 0 to i
                let j = Math.floor(Math.random() * (i + 1));
                // swap element array[i] and array [j] with destructuring
                [used[i], used[j]] = [used[j], used[i]];
            }
            // add shuffled cards to end of live deck
            live.push(...used);
            commit('SET_LIVE', live);
            // reset used deck
            commit('SET_USED', []);
            resolve();
        });
    },
    // moves a random card to hand
    async DEAL_CARD({ state, commit, dispatch }) {
        if (state.live.length <= state.shuffleLimit) {
            await dispatch('SHUFFLE');
        }
        const card = await dispatch('GET_RANDOM_CARD');
        commit('table/PUSH_TO_HAND', card, { root: true });
    },
    // takes a random card out of live deck and returns it
    GET_RANDOM_CARD({ state, commit }) {
        if (state.live.length) {
            // max is the highest index in live deck
            // min is always zero, so it is removed from equation
            const max = state.live.length - 1;
            // get random index from the live deck
            const index = Math.floor(Math.random() * (max + 1));
            // make a copy so we aren't mutating state
            const live = [...state.live];
            // remove card from live deck and store it
            const [card] = live.splice(index, 1);
            // commit new live deck without card
            commit('SET_LIVE', live);
            return card;
        }
    },
};
