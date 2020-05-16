export const state = {
    list: [],
};

export const mutations = {
    ADD_TO_LIST(state, item) {
        state.list.unshift(item);
    },
    CLEAR_LIST(state) {
        state.list = [];
    },
};
