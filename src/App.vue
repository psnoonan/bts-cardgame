<template>
    <div id="app">
        <router-view />
    </div>
</template>

<style lang="scss">
*,
*:before,
*:after {
    box-sizing: border-box;
}
html {
    padding: 2rem;
    font-size: 18px;
    font-family: Dosis, sans-serif;
    background-color: #fff;
    text-size-adjust: 100%;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
}
body {
    margin: 0;
}
h1,
h2,
h3,
h4,
h5,
h6 {
    line-height: 1;
    margin: 0;
    padding: 0;
}
@media screen and (max-width: 400px) {
    html {
        padding: 1rem;
    }
}
</style>
