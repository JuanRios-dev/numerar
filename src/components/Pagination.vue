<template>
    <div class="pagination">
        <button 
            :disabled="currentPage === 1" 
            @click="changePage(currentPage - 1)">
            Previous
        </button>
        <button 
            v-for="page in pages" 
            :key="page" 
            :class="{ active: page === currentPage }" 
            @click="changePage(page)">
            {{ page }}
        </button>
        <button 
            :disabled="currentPage === totalPages" 
            @click="changePage(currentPage + 1)">
            Next
        </button>
    </div>
</template>

<script>
export default {
    props: {
        currentPage: {
            type: Number,
            required: true
        },
        totalPages: {
            type: Number,
            required: true
        }
    },
    computed: {
        pages() {
            const range = [];
            for (let i = 1; i <= this.totalPages; i++) {
                range.push(i);
            }
            return range;
        }
    },
    methods: {
        changePage(page) {
            if (page !== this.currentPage && page > 0 && page <= this.totalPages) {
                this.$emit('page-changed', page);
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.pagination {
    display: flex;
    justify-content: center;
    margin-top: 10px;

    button {
    margin: 0 5px;
    padding: 5px 10px;
    font-size: 0.8rem;
    border: 1px solid #ddd;
    background-color: #fff;
    cursor: pointer;

    &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }

    &.active {
        font-weight: bold;
        border: 1px solid $secondary-color;
        background-color: $secondary-color;
        color: #fff;
    }
}
}
</style>
