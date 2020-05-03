<template>
    <div class="playing-card" :style="{ color }">
        <div class="label top-left">
            {{ card.label }}
            <IconBase
                v-if="card.label === 'A'"
                :key="aceValue"
                :icon-name="aceValue"
                :view-box="16"
                :class="['ace-value', aceValue]"
                stroke="none"
            />
        </div>

        <IconBase
            :key="card.suit"
            :icon-name="card.suit"
            :view-box="226"
            stroke="none"
            class="suit"
        />

        <div class="label bottom-right">{{ card.label }}</div>
    </div>
</template>

<script>
import IconBase from '@/components/icon-base';

export default {
    name: 'PlayingCard',
    components: {
        IconBase,
    },
    props: {
        card: {
            type: Object,
            required: true,
        },
    },
    computed: {
        color() {
            if (this.card.suit === 'hearts' || this.card.suit === 'diamonds') {
                return '#d12d36';
            }
            return '#000';
        },
        aceValue() {
            return this.card.value === 1 ? 'low' : 'high';
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
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14),
        0 3px 1px -2px rgba(0, 0, 0, 0.12);
    border-radius: 5px;
}
.label {
    position: absolute;
    --pad: 8%;
    font-size: 1.5rem;
    &.top-left {
        top: var(--pad);
        left: var(--pad);
        display: flex;
        align-items: center;
        .ace-value {
            width: 1rem;
            margin-left: 5px;
            fill: currentColor;
            &.low {
                transform: translateY(8px);
            }
            &.high {
                transform: translateY(-3px);
            }
        }
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
    width: 2rem;
}
</style>
