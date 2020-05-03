<template>
    <transition-group name="fade-down" tag="div" class="hand">
        <PlayingCard
            v-for="(card, index) in hand"
            :key="`${card.label}-${index}`"
            :card="card"
            :class="cardPosition(index)"
        />
    </transition-group>
</template>

<script>
import PlayingCard from '@/components/playing-card';

export default {
    name: 'Hand',
    components: {
        PlayingCard,
    },
    props: {
        hand: {
            type: Array,
            required: true,
        },
    },
    methods: {
        cardPosition(index) {
            switch (index) {
                case 0:
                    return 'first';
                case 1:
                    return 'third';
                case 3:
                    return 'second';
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.hand {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-areas: 'first second third';
    grid-gap: 1rem;
    width: 100%;
    max-width: 400px;
    margin-bottom: 1rem;
}
.first {
    grid-area: first;
}
.second {
    grid-area: second;
}
.third {
    grid-area: third;
}

.fade-down-enter-active,
.fade-down-leave-active {
    transition: all 250ms cubic-bezier(0.25, 0.8, 0.25, 1);
}
.fade-down-enter,
.fade-down-leave-to {
    opacity: 0;
    transform: translateY(-25%);
}
</style>
