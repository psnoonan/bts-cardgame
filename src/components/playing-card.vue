<template>
    <div class="playing-card" :style="{ color }">
        <div class="label top-left">
            {{ card.label }}
            <span v-if="card.label === 'A'">
                ({{ card.value === 1 ? 'low' : 'high' }})
            </span>
        </div>

        <div class="suit">{{ card.suit }}</div>

        <div class="label bottom-right">{{ card.label }}</div>
    </div>
</template>

<script>
export default {
    name: 'PlayingCard',
    props: {
        card: {
            type: Object,
            required: true,
        },
    },
    computed: {
        color() {
            if (this.card.suit === 'hearts' || this.card.suit === 'diamonds') {
                return 'darkred';
            }
            return 'black';
        },
    },
};
</script>

<style lang="scss" scoped>
.playing-card {
    position: relative;
    height: 0;
    // playing card ratio
    padding-top: 350 / 225 * 100%;
    line-height: 1rem;
    font-size: 1.5rem;
    font-weight: bold;
    background-color: #fff;
    border: 1px solid #000;
    border-radius: 5px;
}
.label {
    position: absolute;
    --pad: 8%;
    font-size: 1.5rem;
    &.top-left {
        top: var(--pad);
        left: var(--pad);
    }
    &.bottom-right {
        bottom: var(--pad);
        right: var(--pad);
    }
}
.suit {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>
