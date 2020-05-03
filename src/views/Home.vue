<template>
    <div class="home">
        <h2>BTS Card Game</h2>
        <h3>Proof of Concept</h3>

        <Hand :hand="hand" />

        <div v-if="result" class="result">
            <span class="label">Result: </span>
            <span>{{ result }}</span>
        </div>

        <div class="actions">
            <transition name="fade" mode="out-in">
                <button
                    v-if="deckLive.length <= shuffleLimit"
                    key="shuffle"
                    @click="shuffle"
                >
                    Shuffle
                </button>

                <button v-else key="deal" @click="dealCard">
                    Deal Card
                </button>
            </transition>
        </div>

        <div class="counts">
            <div>Cards Remaining: {{ deckLive.length }}</div>
            <div>Cards Used: {{ deckUsed.length }}</div>
        </div>
    </div>
</template>

<script>
import deckSeed from '@/helpers/deck-seed';

import Hand from '@/components/hand';

export default {
    name: 'Home',
    components: {
        Hand,
    },
    data() {
        return {
            shuffleLimit: 5,
            deckLive: [],
            deckUsed: [],
            hand: [],
            result: '',
        };
    },
    computed: {
        firstCard() {
            return this.hand[0];
        },
        secondCard() {
            return this.hand[1];
        },
        yourCard() {
            return this.hand[2];
        },
    },
    created() {
        this.deckUsed = deckSeed;
        this.shuffle();
    },
    methods: {
        shuffle() {
            // assign used deck to variable for typing ease
            const arr = this.deckUsed;
            for (let i = arr.length - 1; i > 0; i--) {
                // Set j to random index from 0 to i
                let j = Math.floor(Math.random() * (i + 1));
                // swap element array[i] and array [j] with destructuring
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            // add shuffled cards to end of live deck
            this.deckLive.push(...arr);
            // reset used deck
            this.deckUsed = [];
        },
        async dealCard() {
            if (this.deckLive.length > this.shuffleLimit) {
                const card = this.getRandomCard();
                this.hand.push(card);
                if (card.value === null && this.hand.length <= 2) {
                    card.value = await this.getAceValue();
                }
                if (this.hand.length === 2) {
                    const willPlay = await this.getChoice();
                    if (!willPlay) {
                        this.clearHand();
                    } else {
                        this.dealCard();
                    }
                } else if (this.hand.length === 3) {
                    this.result = this.getResult();
                    await this.displayResult(this.result);
                    this.clearHand();
                }
            } else {
                alert('You need to shuffle');
            }
        },
        getRandomCard() {
            if (this.deckLive.length) {
                // max is the highest index in live deck
                // min is always zero, so it is removed from equation
                const max = this.deckLive.length - 1;
                // get random index from the live deck
                const index = Math.floor(Math.random() * (max + 1));
                // remove card from live deck and store it
                const [card] = this.deckLive.splice(index, 1);
                return card;
            }
        },
        getAceValue() {
            return new Promise(resolve => {
                setTimeout(() => {
                    const shouldSwitchToHigh = confirm(
                        "It's an ACE! OK for high, Cancel for low"
                    );
                    const newValue = shouldSwitchToHigh ? 14 : 1;
                    resolve(newValue);
                }, 100);
            });
        },
        getChoice() {
            return new Promise(resolve => {
                setTimeout(() => {
                    const choice = confirm('OK to play, Cancel to pass');
                    resolve(choice);
                }, 100);
            });
        },
        getResult() {
            const lowValue = Math.min(
                this.firstCard.value,
                this.secondCard.value
            );
            const highValue = Math.max(
                this.firstCard.value,
                this.secondCard.value
            );
            const yourValue = this.yourCard.value;
            let message = '';
            if (
                // Always lose double if your card is ace and either end is also ace
                (this.firstCard.label === 'A' ||
                    this.secondCard.label === 'A') &&
                this.yourCard.label === 'A'
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
                // Hopefully never get here
                message = 'There was a problem. :-(';
            }
            return message;
        },
        displayResult(result) {
            return new Promise(resolve => {
                setTimeout(() => {
                    alert(result);
                    resolve();
                }, 100);
            });
        },
        clearHand() {
            this.hand.forEach(card => {
                if (card.label === 'A') {
                    card.value = null;
                }
                this.deckUsed.push(card);
            });
            this.hand = [];
            this.result = '';
        },
    },
};
</script>

<style lang="scss" scoped>
h2 {
    margin: 0 0 0.5rem 0;
    line-height: 1;
}
h3 {
    margin: 0 0 1rem 0;
    line-height: 1;
}
.actions {
    margin-bottom: 1rem;
}
button {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    text-transform: uppercase;
    cursor: pointer;
    &:hover {
        background-color: goldenrod;
    }
}
.label {
    text-transform: uppercase;
    opacity: 0.5;
    font-weight: bold;
}
.result {
    margin-bottom: 1rem;
    padding-top: 0.5rem;
    font-size: 1.2rem;
}

.fade-enter-active,
.fade-leave-active {
    transition: all 350ms ease-in-out;
}
.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>
