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
</style>
