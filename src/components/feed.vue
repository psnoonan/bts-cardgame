<template>
    <transition-group tag="ul" name="list" class="feed">
        <li v-for="(line, index) in feed" :key="feed.length - index">
            {{ line }}
        </li>
    </transition-group>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'Feed',
    computed: {
        ...mapState({
            feed: state => state.feed.list,
        }),
    },
};
</script>

<style lang="scss" scoped>
.feed {
    margin: 0;
    padding: 0;
    list-style-type: none;
    font-size: 1.2rem;
    li {
        padding: 0.5rem 1rem;
        &:nth-child(even) {
            background-color: #f6f6fc;
        }
    }
}

.list-enter-active,
.list-leave-active {
    transition: all 350ms cubic-bezier(0.25, 0.8, 0.25, 1);
}
.list-move {
    transition: all 250ms cubic-bezier(0.25, 0.8, 0.25, 1);
}
.list-enter,
.list-leave-to {
    opacity: 0;
    transform: translateX(-25%);
}
</style>
