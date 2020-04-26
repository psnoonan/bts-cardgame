<template>
    <div class="home">
        <h1>BTS Card Game</h1>
        <h2>Proof of Concept</h2>

        <div>Cards Remaining: {{ deckLive.length }}</div>
        <div>Cards Used: {{ deckUsed.length }}</div>

        <button v-if="deckLive.length <= shuffleLimit" @click="shuffle">
            Shuffle
        </button>

        <button v-if="deckLive.length > shuffleLimit" @click="dealCard">
            Deal Card
        </button>

        <div v-if="firstCard">
            <span>First Card: </span>
            <span>{{ firstCard.label }} of {{ firstCard.suit }} </span>
            <span>({{ firstCard.value }})</span>
        </div>

        <div v-if="secondCard">
            <span>Second Card: </span>
            <span>{{ secondCard.label }} of {{ secondCard.suit }} </span>
            <span>({{ secondCard.value }})</span>
        </div>

        <div v-if="yourCard">
            <span>Your Card: </span>
            <span>{{ yourCard.label }} of {{ yourCard.suit }} </span>
            <span>({{ yourCard.value }})</span>
        </div>
    </div>
</template>

<script>
import deckSeed from '@/helpers/deck-seed';

export default {
    name: 'Home',
    data() {
        return {
            shuffleLimit: 5,
            deckLive: [],
            deckUsed: [],
            firstCard: null,
            secondCard: null,
            yourCard: null,
        };
    },
    created() {
        this.deckUsed = deckSeed;
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
                if (!this.firstCard) {
                    this.firstCard = this.getRandomCard();
                    if (this.firstCard.value === 1) {
                        this.firstCard.value = await this.getAceValue();
                    }
                } else if (!this.secondCard) {
                    this.secondCard = this.getRandomCard();
                    if (this.secondCard.value === 1) {
                        this.secondCard.value = await this.getAceValue();
                    }
                    const willPlay = await this.getChoice();
                    if (!willPlay) {
                        this.clearHand();
                    } else {
                        this.dealCard();
                    }
                } else if (!this.yourCard) {
                    this.yourCard = this.getRandomCard();
                    const result = this.getResult();
                    await this.displayResult(result);
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
            if (yourValue === lowValue || yourValue === highValue) {
                message = 'You lose DOUBLE!';
            } else if (yourValue < lowValue || yourValue > highValue) {
                message = 'You LOSE!';
            } else if (yourValue > lowValue && yourValue < highValue) {
                message = 'You WIN!';
            } else {
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
            if (this.firstCard) {
                this.deckUsed.push(this.firstCard);
            }
            if (this.secondCard) {
                this.deckUsed.push(this.secondCard);
            }
            if (this.yourCard) {
                this.deckUsed.push(this.yourCard);
            }
            this.firstCard = null;
            this.secondCard = null;
            this.yourCard = null;
        },
    },
};
</script>
