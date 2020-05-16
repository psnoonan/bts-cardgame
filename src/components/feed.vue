<template>
    <ul class="feed">
        <li v-for="(line, index) in feed" :key="index">{{ line }}</li>
    </ul>
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
