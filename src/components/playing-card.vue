<template>
    <div :class="['playing-card', card.suit]">
        <div class="label">
            {{ card.label }}
            <IconBase
                v-if="card.label === 'A' && card.value"
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

        <transition name="fade">
            <div v-if="!card.value" key="card-value" class="choice-prompt">
                <button
                    class="choice choice--high"
                    @click="$emit('select-high')"
                >
                    High
                </button>

                <button class="choice choice--low" @click="$emit('select-low')">
                    Low
                </button>
            </div>
        </transition>
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
        aceValue() {
            return this.card.value === 1 ? 'low' : 'high';
        },
    },
};
</script>

<style lang="scss" scoped>
.playing-card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 1rem;
    background-color: #fff;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14),
        0 3px 1px -2px rgba(0, 0, 0, 0.12);
    border-radius: 5px;
    overflow: hidden;
    &.hearts,
    &.diamonds {
        color: #f25767;
    }
    &.clubs,
    &.spades {
        color: #332a7c;
    }
}
.label {
    display: flex;
    align-items: center;
    font-weight: bold;
    font-size: 76px;
    line-height: 1;
    .ace-value {
        width: 1rem;
        margin-left: 5px;
        fill: currentColor;
        display: flex;
        align-items: center;
        &.low {
            transform: translateY(5px);
        }
        &.high {
            transform: translateY(-7px);
        }
    }
}
.suit {
    align-self: flex-end;
    width: 85%;
}
.choice-prompt {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(#000, 0.45);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    .choice {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 85%;
        margin: 0.5rem 10px;
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

@media screen and (max-width: 1400px) {
    .label {
        font-size: 60px;
    }
}
@media screen and (max-width: 990px) {
    .label {
        font-size: 76px;
    }
}
@media screen and (max-width: 850px) {
    .label {
        font-size: 60px;
    }
}
@media screen and (max-width: 750px) {
    .label {
        font-size: 76px;
    }
}
@media screen and (max-width: 550px) {
    .label {
        font-size: 48px;
    }
}
@media screen and (max-width: 450px) {
    .playing-card {
        padding: 0.5rem;
    }
}
@media screen and (max-width: 400px) {
    .label {
        font-size: 36px;
    }
}

.fade-enter-active {
    transition: all 300ms cubic-bezier(0.25, 0.8, 0.25, 1);
    transition-delay: 6000ms;
}
.fade-enter {
    opacity: 0;
}
.fade-leave-active {
    transition: all 300ms cubic-bezier(0.25, 0.8, 0.25, 1);
}
.fade-leave-to {
    opacity: 0;
}
</style>
