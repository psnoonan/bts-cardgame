<template>
    <header>
        <div class="title">
            <h1>Between The Sheets</h1>
            <h2>The Card Game</h2>
        </div>
    </header>
</template>

<script>
export default {
    name: 'LayoutHeader',
};
</script>

<style lang="scss" scoped>
header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.title {
    padding: 1rem 2rem;
    border-radius: 1rem;
    background-color: #332a7c;
    color: #fff;
    h1 {
        margin-bottom: 0.25rem;
    }
    h2 {
        font-weight: 400;
    }
}
</style>
