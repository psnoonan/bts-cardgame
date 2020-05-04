<template>
    <div class="table">
        <div
            v-for="i in 3"
            :key="i"
            :class="['spot', `spot--${spotPosition(i - 1)}`]"
        >
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
    },
    methods: {
        spotPosition(index) {
            switch (index) {
                case 0:
                    return 'first';
                case 1:
                    return 'second';
                case 2:
                    return 'your';
            }
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
    &.spot--first {
        grid-area: first;
    }
    &.spot--second {
        grid-area: second;
    }
    &.spot--your {
        grid-area: your;
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
}
.fade-down-enter,
.fade-down-leave-to {
    opacity: 0;
    transform: translateY(-25%);
}

@media screen and (max-width: 500px) {
    .table {
        padding: 1rem;
    }
}
</style>
