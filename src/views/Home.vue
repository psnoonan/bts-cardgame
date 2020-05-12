<template>
    <div class="home">
        <LayoutHeader class="layout-header" />

        <Table
            :table="table"
            :next-card="nextCard"
            class="layout-table"
            @deal-card="dealCard"
            @select-high="table[nextCard].value = 14"
            @select-low="table[nextCard].value = 1"
        />

        <div class="layout-actions">
            <button @click="clearTable">
                Clear Table
            </button>
        </div>

        <Feed :feed="feed" class="layout-feed" />

        <div class="info">
            <div class="counts">
                <div>Deck: {{ deckLive.length }}</div>
                <div>Discard Pile: {{ deckUsed.length }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import deckSeed from '@/helpers/deck-seed';

import LayoutHeader from '@/components/layout/header';
import Table from '@/components/table';
import Feed from '@/components/feed';

export default {
    name: 'Home',
    components: {
        LayoutHeader,
        Table,
        Feed,
    },
    data() {
        return {
            shuffleLimit: 5,
            deckLive: [],
            deckUsed: [],
            table: [],
            feed: [],
        };
    },
    computed: {
        firstCard() {
            return this.table[0];
        },
        secondCard() {
            return this.table[1];
        },
        yourCard() {
            return this.table[2];
        },
        nextCard() {
            if (!this.firstCard || !this.firstCard.value) {
                return 0;
            } else if (!this.secondCard || !this.secondCard.value) {
                return 1;
            } else {
                return 2;
            }
        },
    },
    async created() {
        this.deckUsed = deckSeed;
        await this.shuffle();
    },
    methods: {
        shuffle() {
            return new Promise(resolve => {
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
                resolve();
            });
        },
        async dealCard() {
            if (this.deckLive.length <= this.shuffleLimit) {
                await this.shuffle();
            }
            const card = this.getRandomCard();
            this.table.push(card);
            if (this.table.length === 2) {
                const willPlay = await this.getChoice();
                if (!willPlay) {
                    this.clearTable();
                } else {
                    this.dealCard();
                }
            } else if (this.table.length === 3) {
                this.feed.unshift(this.getResult());
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
        clearTable() {
            this.table.forEach(card => {
                if (card.label === 'A') {
                    card.value = null;
                }
                this.deckUsed.push(card);
            });
            this.table = [];
            this.result = '';
        },
    },
};
</script>

<style lang="scss" scoped>
.home {
    width: 100%;
    max-width: 1600px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 3fr 4fr 3fr;
    grid-gap: 2rem;
    grid-template-areas:
        'header header header'
        'feed info players'
        'feed table players'
        'feed actions players';
}
.layout-header {
    grid-area: header;
}
.layout-results {
    grid-area: results;
}
.layout-table {
    grid-area: table;
    align-self: center;
}
.layout-actions {
    grid-area: actions;
}
.layout-feed {
    grid-area: feed;
}
.info {
    grid-area: info;
}
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
    transition: all 250ms cubic-bezier(0.25, 0.8, 0.25, 1);
}
.fade-enter,
.fade-leave-to {
    opacity: 0;
}

@media screen and (max-width: 1200px) {
    .home {
        grid-template-columns: 2.5fr 5fr 2.5fr;
    }
}
@media screen and (max-width: 990px) {
    .home {
        grid-template-columns: 6fr 3fr;
        grid-template-areas:
            'header header'
            'info players'
            'table players'
            'actions players'
            'feed players';
    }
}
@media screen and (max-width: 750px) {
    .home {
        grid-template-columns: 1fr 1fr;
        grid-template-areas:
            'header header'
            'info info'
            'table table'
            'actions actions'
            'feed players';
    }
}
</style>
