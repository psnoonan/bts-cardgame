<template>
    <div class="home">
        <LayoutHeader class="layout-header" />

        <div class="info">
            <div class="counts">
                <div><strong>Deck:</strong> {{ deckLive.length }}</div>
                <div><strong>Discard Pile:</strong> {{ deckUsed.length }}</div>
            </div>
        </div>

        <Table class="layout-table" />

        <Feed class="layout-feed" />
    </div>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex';

import LayoutHeader from '@/components/layout/header';
import Table from '@/components/table';
import Feed from '@/components/feed';

export default {
    name: 'Home',
    components: {
        LayoutHeader,
        Table,
        Feed,
    },
    computed: {
        ...mapState({
            deckLive: state => state.deck.live,
            deckUsed: state => state.deck.used,
        }),
        ...mapGetters({
            yourCard: 'table/yourCard',
        }),
    },
    watch: {
        async yourCard(newCard, oldCard) {
            if (newCard && !oldCard) {
                this.addToFeed(await this.getResult());
                setTimeout(() => {
                    this.clearTable();
                }, 1500);
            }
        },
    },
    async created() {
        this.init();
    },
    methods: {
        ...mapMutations({
            addToFeed: 'feed/ADD_TO_LIST',
        }),
        ...mapActions({
            init: 'INIT',
            getResult: 'table/GET_RESULT',
            clearTable: 'table/CLEAR_HAND',
        }),
    },
};
</script>

<style lang="scss" scoped>
.home {
    width: 100%;
    max-width: 1600px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 3fr 4fr 3fr;
    grid-template-rows: max-content max-content auto;
    grid-gap: 2rem;
    grid-template-areas:
        'header header header'
        'feed info players'
        'feed table players';
}
.layout-header {
    grid-area: header;
}
.layout-table {
    grid-area: table;
    align-self: start;
}
.layout-feed {
    grid-area: feed;
}
.info {
    grid-area: info;
    font-size: 1.2rem;
    strong {
        opacity: 0.4;
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: all 250ms cubic-bezier(0.25, 0.8, 0.25, 1);
}
.fade-enter,
.fade-leave-to {
    opacity: 0;
}

@media screen and (max-width: 1200px) {
    .home {
        grid-template-columns: 2.5fr 5fr 2.5fr;
    }
}
@media screen and (max-width: 990px) {
    .home {
        grid-template-columns: 6fr 3fr;
        grid-template-rows: max-content max-content max-content auto;
        grid-template-areas:
            'header header'
            'info players'
            'table players'
            'feed players';
    }
}
@media screen and (max-width: 750px) {
    .home {
        grid-template-columns: 1fr 1fr;
        grid-template-areas:
            'header header'
            'info info'
            'table table'
            'feed players';
    }
}
</style>
