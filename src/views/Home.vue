<template>
    <div class="home">
        <h1>BTS Card Game Proof of Concept</h1>

        <div>Cards Remaining: {{ deckLive.length }}</div>
        <div>Used Cards: {{ deckUsed.length }}</div>

        <button @click="shuffle">Shuffle</button>

        <button @click="dealCard">Deal Card</button>

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
    </div>
</template>

<script>
import deckSeed from '@/helpers/deck-seed';

export default {
    name: 'Home',
    data() {
        return {
            deckLive: [],
            deckUsed: [],
            firstCard: null,
            middleCard: null,
            secondCard: null,
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
        dealCard() {
            if (this.deckLive.length > 3) {
                if (!this.firstCard) {
                    this.firstCard = this.getRandomCard();
                } else if (!this.secondCard) {
                    this.secondCard = this.getRandomCard();
                }
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
                // put card in used deck
                this.deckUsed.push(card);
                // prompt for high or low if an ace
                if (card.value === 1) {
                    console.log('before prompt');
                    const shouldSwitchToHigh = confirm(
                        'Press OK for high, Cancel for low'
                    );
                    card.value = shouldSwitchToHigh ? 14 : 1;
                }
                console.log('after prompt');
                return card;
            }
        },
    },
};
</script>
