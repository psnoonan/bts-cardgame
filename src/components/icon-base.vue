<template>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        :viewBox="`0 0 ${viewBox} ${viewBox}`"
        :aria-labelledby="iconName"
        role="presentation"
    >
        <title :id="iconName" lang="en">{{ iconName }} icon</title>
        <g :fill="fill" :stroke="stroke" :stroke-width="strokeWidth">
            <component :is="iconComponent" />
        </g>
    </svg>
</template>

<script>
export default {
    name: 'IconBase',
    props: {
        iconName: {
            type: String,
            required: true,
        },
        viewBox: {
            type: [Number, String],
            default: 24,
        },
        fill: {
            type: String,
            default: 'currentColor',
        },
        stroke: {
            type: String,
            default: 'currentColor',
        },
        strokeWidth: {
            type: [Number, String],
            default: 2,
        },
    },
    computed: {
        iconComponent() {
            // iconName needs to match the file name of the icon
            return () => import(`@/components/icons/${this.iconName}.vue`);
        },
    },
};
</script>
