<template>
    <ul class="feed">
        <li v-for="(line, index) in feed" :key="index">{{ line }}</li>
    </ul>
</template>

<script>
export default {
    name: 'Feed',
    props: {
        feed: {
            type: Array,
            required: true,
        },
    },
};
</script>
