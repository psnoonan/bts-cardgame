<template>
    <div class="table">
        <div v-for="i in 3" :key="i" :class="['spot', `spot--${i - 1}`]">
            <transition name="shrink">
                <button
                    v-if="i - 1 === nextCard"
                    class="deal-button"
                    @click="$emit('deal-card')"
                >
                    Deal
                </button>
            </transition>

            <transition name="fade-down">
                <PlayingCard
                    v-if="table[i - 1]"
                    :card="table[i - 1]"
                    class="card"
                />
            </transition>
        </div>
    </div>
</template>

<script>
import PlayingCard from '@/components/playing-card';

export default {
    name: 'Table',
    components: {
        PlayingCard,
    },
    props: {
        table: {
            type: Array,
            required: true,
        },
        nextCard: {
            type: Number,
            required: true,
        },
    },
};
</script>

<style lang="scss" scoped>
.table {
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
.deal-button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 0.5rem 1rem;
    font-size: 1rem;
    font-weight: 700;
    line-height: 1;
    text-transform: uppercase;
    border: none;
    border-radius: 100px;
    background-color: #fca001;
    cursor: pointer;
    transition: all 250ms cubic-bezier(0.25, 0.8, 0.25, 1);
    &:hover,
    &:focus {
        outline: none;
        transform: translate(-50%, -50%) rotate(-5deg);
    }
}
.card {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    bottom: 0.5rem;
    left: 0.5rem;
}

.fade-down-enter-active,
.fade-down-leave-active {
    transition: all 250ms cubic-bezier(0.25, 0.8, 0.25, 1);
    transition-delay: 250ms;
}
.fade-down-enter,
.fade-down-leave-to {
    opacity: 0;
    transform: translateY(-25%);
}

.shrink-enter-active,
.shrink-leave-active {
    transition: all 350ms cubic-bezier(0.25, 0.8, 0.25, 1);
}
.shrink-enter,
.shrink-leave-to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.5);
}

@media screen and (max-width: 500px) {
    .table {
        padding: 1rem;
    }
}
</style>
