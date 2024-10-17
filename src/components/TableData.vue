<template>
    <div class="table-toolbar">
        <div class="search-container">
            <input type="text" placeholder="Buscar..." @input="handleSearch" />
        </div>

        <div class="action-buttons">
            <slot name="buttons"></slot>
        </div>
    </div>

    <div class="table-container">
        <table>
            <thead>
                <tr>
                    <th v-for="(header, index) in headers" :key="index" @click="sortBy(header.key)">
                        {{ header.label }}
                        <span v-if="sortKey === header.key">
                            {{ sortOrder === 'asc' ? '▲' : '▼' }}
                        </span>
                    </th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(element, index) in paginatedData" :key="index">
                    <td v-for="(header, keyIndex) in headers" :key="keyIndex">{{ element[header.key] }}</td>
                    <td class="custom-buttons">
                        <div class="flex">
                            <slot name="action-buttons" :element="element"></slot>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <pagination :current-page="currentPage" :total-pages="totalPages" @page-changed="handlePageChange" />
    </div>
</template>

<script>
import Pagination from '@/components/Pagination.vue'

export default {
    components: {
        Pagination
    },
    props: {
        headers: {
            type: Array,
            required: true
        },
        data: {
            type: Array,
            required: true
        },
        rowsPerPage: {
            type: Number,
            default: 5
        }
    },
    data() {
        return {
            currentPage: 1,
            searchTerm: '',
            sortKey: '',
            sortOrder: 'asc'
        };
    },
    computed: {
        filteredData() {
            if (this.searchTerm === '') {
                return this.data;
            }
            return this.data.filter(item => {
                return this.headers.some(header => {
                    return String(item[header.key]).toLowerCase().includes(this.searchTerm.toLowerCase());
                });
            });
        },
        sortedData() {
            if (this.sortKey === '') {
                return this.filteredData;
            }
            return this.filteredData.slice().sort((a, b) => {
                let result = 0;
                if (a[this.sortKey] > b[this.sortKey]) {
                    result = 1;
                } else if (a[this.sortKey] < b[this.sortKey]) {
                    result = -1;
                }
                return this.sortOrder === 'asc' ? result : -result;
            });
        },
        totalPages() {
            return Math.ceil(this.sortedData.length / this.rowsPerPage);
        },
        paginatedData() {
            const start = (this.currentPage - 1) * this.rowsPerPage;
            const end = start + this.rowsPerPage;
            return this.sortedData.slice(start, end);
        }
    },
    methods: {
        handleSearch(event) {
            this.searchTerm = event.target.value;
            this.currentPage = 1; // Reset to first page on search
        },
        handlePageChange(page) {
            this.currentPage = page;
        },
        sortBy(key) {
            if (this.sortKey === key) {
                this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
            } else {
                this.sortKey = key;
                this.sortOrder = 'asc';
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.table-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    width: 100%;

    .search-container {
        display: flex;
        align-items: center;
        width: 250px;

        input {
            width: 100%;
            padding: 6px;
            margin-right: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            outline: none;
        }
    }

    .action-buttons {
        display: flex;
        align-items: center;
    }
}

.table-container {
    width: 100%;
    max-width: 100%;
    overflow-x: auto;
}

table {
    width: 100%;
    min-width: 600px;
    border-collapse: collapse;
    text-align: left;
    margin-bottom: 10px;

    th,
    td {
        padding: 8px 10px;
        white-space: nowrap;
        font-size: 0.8rem;
        border: 1px solid #ddd;
    }

    th {
        background-color: $primary-color;
        color: $white;
        font-weight: 800;
        border: 1px solid $primary-color;
        cursor: pointer;
    }

    td {
        font-weight: 400;
        border: 1px solid #ddd;
    }

    .custom-buttons {
        .flex{
            display: flex;
        }
    }

    tbody tr:nth-of-type(odd) {
        background-color: #f9f9f9;
    }

    tbody tr:nth-of-type(even) {
        background-color: #fff;
    }

    tbody tr:hover {
        background-color: #f1f1f1;
    }
}
</style>