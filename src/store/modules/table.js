export const state = {
    hand: [],
};

export const getters = {
    firstCard: state => state.hand[0],
    secondCard: state => state.hand[1],
    yourCard: state => state.hand[2],
};

export const mutations = {
    SET_HAND(state, handArray) {
        state.hand = handArray;
    },
    PUSH_TO_HAND(state, card) {
        state.hand.push(card);
    },
    SET_ACE_VALUE(state, { index, value }) {
        state.hand[index].value = value;
    },
    CLEAR_ACE_VALUES(state) {
        state.hand.forEach(card => {
            // reset any ace values
            if (card.label === 'A') {
                card.value = null;
            }
        });
    },
};

export const actions = {
    CLEAR_HAND({ state, commit }) {
        commit('CLEAR_ACE_VALUES');
        state.hand.forEach(card => {
            commit('deck/PUSH_TO_USED', card, { root: true });
        });
        commit('SET_HAND', []);
    },
    GET_RESULT({ state, getters }) {
        // Make sure we have enough info to get a result
        if (
            state.hand.length === 3 &&
            getters.firstCard.value &&
            getters.secondCard.value
        ) {
            // find lowest value between two end cards
            const lowValue = Math.min(
                getters.firstCard.value,
                getters.secondCard.value
            );
            // find highest value between two end cards
            const highValue = Math.max(
                getters.firstCard.value,
                getters.secondCard.value
            );
            // get your value
            const yourValue = getters.yourCard.value;
            let message = '';
            if (
                // Always lose double if your card is ace and either end is also ace
                (getters.firstCard.label === 'A' ||
                    getters.secondCard.label === 'A') &&
                getters.yourCard.label === 'A'
            ) {
                message = 'You lose DOUBLE';
            } else if (yourValue === lowValue || yourValue === highValue) {
                // Also lose double if your value is the same as either end
                message = 'You lose DOUBLE!';
            } else if (yourValue < lowValue || yourValue > highValue) {
                // You lose your bet if your value is outside either end
                message = 'You LOSE!';
            } else if (yourValue > lowValue && yourValue < highValue) {
                // You win your bet if you value is inside either end
                message = 'You WIN!';
            } else {
                // Should handle everything above, so hopefully never get here
                message = 'There was a problem. :-(';
            }
            return message;
        } else {
            return null;
        }
    },
};
