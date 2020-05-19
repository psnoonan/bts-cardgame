<template>
    <div class="table">
        <div v-for="i in 3" :key="i" :class="['spot', `spot--${i - 1}`]">
            <transition name="fade-down">
                <PlayingCard
                    v-if="hand[i - 1]"
                    key="card"
                    :card="hand[i - 1]"
                    :index="i - 1"
                    class="card"
                />
            </transition>
        </div>

        <div class="actions">
            <transition name="shrink" mode="out-in">
                <button
                    v-if="!firstCard"
                    key="deal-button"
                    class="choice choice--deal"
                    @click="dealCard"
                >
                    Deal
                </button>

                <div
                    v-if="secondCard && secondCard.value && !yourCard"
                    key="choice-prompt"
                    class="choice-prompt"
                >
                    <button class="choice choice--play" @click="dealCard">
                        Play
                    </button>

                    <button class="choice choice--pass" @click="pass">
                        Pass
                    </button>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex';

import PlayingCard from '@/components/playing-card';

export default {
    name: 'Table',
    components: {
        PlayingCard,
    },
    computed: {
        ...mapState({
            hand: state => state.table.hand,
        }),
        ...mapGetters({
            firstCard: 'table/firstCard',
            secondCard: 'table/secondCard',
            yourCard: 'table/yourCard',
        }),
    },
    watch: {
        firstCard(newCard, oldCard) {
            if (!oldCard && newCard.value) {
                setTimeout(() => {
                    this.dealCard();
                }, 350);
            }
        },
    },
    methods: {
        ...mapMutations({
            addToFeed: 'feed/ADD_TO_LIST',
        }),
        ...mapActions({
            dealCard: 'deck/DEAL_CARD',
            clearTable: 'table/CLEAR_HAND',
        }),
        pass() {
            this.addToFeed('You Passed.');
            this.clearTable();
        },
    },
};
</script>

<style lang="scss" scoped>
.table {
    position: relative;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-areas: 'first your second';
    grid-gap: 1rem;
    width: 100%;
    padding: 2rem;
    border-radius: 1rem;
    background-color: #07724f;
}
.spot {
    position: relative;
    background-color: #0d9066;
    height: 0;
    // playing card ratio
    padding-top: 350 / 225 * 100%;
    border-radius: 0.5rem;
    &.spot--0 {
        grid-area: first;
    }
    &.spot--1 {
        grid-area: second;
    }
    &.spot--2 {
        grid-area: your;
    }
}
.actions {
    grid-area: your;
    position: absolute;
    top: 50%;
    transform: translate3d(0, -50%, 0);
    width: 100%;
    padding: 0 0.5rem;
    .choice {
        width: 100%;
        margin: 0.5rem 0;
        padding: 0.5rem;
        font-size: 1rem;
        font-weight: 700;
        line-height: 1;
        color: #fff;
        text-shadow: 1px 1px 1px rgba(#454545, 0.4);
        text-transform: uppercase;
        border: none;
        border-radius: 100px;
        background-color: #fca001;
        cursor: pointer;
        transition: all 250ms cubic-bezier(0.25, 0.8, 0.25, 1);
        &:hover,
        &:focus {
            outline: none;
            transform: rotate(-5deg);
        }
    }
}
.card {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    bottom: 0.5rem;
    left: 0.5rem;
}

@media screen and (max-width: 500px) {
    .table {
        padding: 1rem;
    }
}

.fade-down-enter-active {
    transition: all 300ms cubic-bezier(0.25, 0.8, 0.25, 1);
    transition-delay: 300ms;
}
.fade-down-enter {
    opacity: 0;
    transform: translateY(-25%);
}
// separate enter and leave to sync with button transition
.fade-down-leave-active {
    transition: all 300ms cubic-bezier(0.25, 0.8, 0.25, 1);
}
.fade-down-leave-to {
    opacity: 0;
    transform: translateY(-25%);
}

.shrink-enter-active {
    transition: all 300ms cubic-bezier(0.25, 0.8, 0.25, 1);
    transition-delay: 300ms;
}
.shrink-enter {
    opacity: 0;
    transform: scale(0.5);
}
// separate enter and leave to sync with card transition
.shrink-leave-active {
    transition: all 300ms cubic-bezier(0.25, 0.8, 0.25, 1);
}
.shrink-leave-to {
    opacity: 0;
    transform: scale(0.5);
}
</style>
