<template>
    <MainLayout>
        <div class="movement-create">
            <!-- Encabezado del formulario -->
            <div class="movement-header">
                <div class="form-row">
                    <div class="form-group">
                        <label for="fecha">Fecha</label>
                        <v-icon name="md-erroroutline" class="error-icon" v-if="errors.fecha"></v-icon>
                        <input type="date" id="fecha" v-model="movement.fecha"
                            :class="{ 'error-input': errors.fecha }" />
                        <div class="error-container">
                            <span class="error-message" v-if="errors.fecha">{{ errors.fecha }}</span>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="tipo">Tipo</label>
                        <select id="tipo" v-model="movement.tipo">
                            <option value="1">Entrada</option>
                            <option value="0">Salida</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="detalles">Detalles</label>
                        <v-icon name="md-erroroutline" class="error-icon" v-if="errors.detalles"></v-icon>
                        <input type="text" id="detalles" v-model="movement.detalles"
                            :class="{ 'error-input': errors.detalles }" />
                        <div class="error-container">
                            <span class="error-message" v-if="errors.detalles">{{ errors.detalles }}</span>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="total">Total</label>
                        <v-icon name="md-erroroutline" class="error-icon" v-if="errors.total"></v-icon>
                        <input type="number" id="total" v-model.number="movement.total" step="0.01" min="0" disabled
                            :class="{ 'error-input': errors.total }" />
                        <div class="error-container">
                            <span class="error-message" v-if="errors.total">{{ errors.total }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="search-products">
                <div class="search-wrapper">
                    <input type="text" placeholder="Buscar producto..." v-model="searchQuery" @input="fetchProducts"
                        @blur="hideResults" @focus="showResults" />
                </div>

                <Button @click="save" :title="'Guardar'" :icon="'IoAddCircleSharp'" :color="'#074F8E'"></Button>

                <ul v-if="searchQuery" class="product-results">
                    <li v-for="item in filteredProducts" :key="item.id" @click="selectProduct(item)">
                        <img :src="`https://app.alernal.com.co${item.imagen}`" alt="producto" />
                        <div class="product-info">
                            <h4>{{ item.nombre }}</h4>
                            <p>Código: {{ item.codigo }}</p>
                            <p>Lote: {{ item.numero }}</p>
                            <p>Categoría: {{ item.categoria }}</p>
                            <p class="price">$ {{ item.precio }}</p>
                        </div>
                        <button>Seleccionar</button>
                    </li>
                </ul>
            </div>

            <table class="product-table">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Costo Unitario</th>
                        <th>Costo Total</th>
                        <th>Lote</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(product, index) in movement.products" :key="index">
                        <td>{{ product.nombre }}</td>
                        <td>
                            <input type="number" v-model.number="product.cantidad" min="1" @input="updateTotal(index)"
                                :class="{ 'error-input': errors[`products_${index}`]?.cantidad }" />
                        </td>
                        <td>
                            <input type="number" v-model.number="product.costo_unitario" step="0.01" min="0"
                                @input="updateTotal(index)"
                                :class="{ 'error-input': errors[`products_${index}`]?.costo_unitario }" />
                        </td>
                        <td>
                            <input type="number" v-model.number="product.costo_total" step="0.01" min="0" disabled
                                :class="{ 'error-input': errors[`products_${index}`]?.costo_total }" />
                        </td>
                        <td>
                            <input type="text" v-model="product.numero" placeholder="No tiene" disabled />
                        </td>
                        <td>
                            <button @click="removeProduct(index)" class="remove-product-button">
                                <v-icon name="ri-delete-back-2-fill" />
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </MainLayout>
</template>

<script>
import MainLayout from '@/layouts/MainLayout.vue';
import { defineComponent } from 'vue';
import { addIcons } from 'oh-vue-icons';
import {
    RiDeleteBack2Fill,
    MdErroroutline

} from 'oh-vue-icons/icons';
import Button from '@/components/Button.vue'
import movementService from '@/services/movementService.js';

addIcons(
    RiDeleteBack2Fill,
    MdErroroutline
);

export default defineComponent({
    name: 'MovementCreate',
    components: {
        MainLayout,
        Button
    },
    data() {
        return {
            movement: {
                fecha: '',
                tipo: '1',
                detalles: '',
                total: 0,
                products: [],
            },
            items: [],
            filteredProducts: [],
            searchQuery: '',
            movementService: new movementService(),
            showProductResults: false,
            errors: {},
        };
    },
    methods: {
        async fetchProducts() {
            clearTimeout(this.searchTimeout);

            this.searchTimeout = setTimeout(async () => {
                if (!this.searchQuery.trim()) {
                    this.filteredProducts = [];
                    return;
                }

                try {
                    const response = await axios.get('/items/search', {
                        params: { search: this.searchQuery },
                    });
                    this.items = response.data.items || [];
                    this.filteredProducts = this.items;
                } catch (error) {
                    console.error('Error al cargar los productos:', error);
                }
            }, 500);
        },
        filterProducts() {
            this.filteredProducts = this.items.filter((item) =>
                item.nombre.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                item.codigo.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        },
        selectProduct(item) {
            const existingProduct = this.movement.products.find(
                product => product.id === item.id && product.lot_id === item.lot_id
            );

            if (existingProduct) {
                existingProduct.cantidad += 1;
            } else {
                this.movement.products.push({
                    id: item.id,
                    nombre: item.nombre,
                    cantidad: 1,
                    costo_unitario: 0,
                    costo_total: 0,
                    lot_id: item.lot_id,
                    numero: item.numero
                });
            }
            this.searchQuery = '';
            this.filteredProducts = [];
        },
        removeProduct(index) {
            this.movement.products.splice(index, 1);
            this.calculateTotal();
        },
        updateTotal(index) {
            const product = this.movement.products[index];
            product.costo_total = product.cantidad * product.costo_unitario;
            this.calculateTotal();
        },
        calculateTotal() {
            this.movement.total = this.movement.products.reduce(
                (sum, p) => sum + p.costo_total,
                0
            );
        },
        async save() {
            const result = await this.movementService.saveData(this.movement);

            if (result.errors) {
                this.errors = result.errors
            }

            console.log(this.errors, result.error)
        },
    },
    mounted() {
        this.fetchProducts();
    },
});
</script>

<style lang="scss">
.movement-create {
    width: 100%;
    padding: 2rem;
    font-family: 'Roboto', sans-serif;
    color: #333;

    .movement-header {
        margin-bottom: 2rem;

        .form-row {
            display: flex;
            gap: 20px;
            width: 100%;
            justify-content: space-between;
            flex-wrap: wrap;

            .form-group {
                flex: 1 1 200px;
                position: relative;
                min-width: 200px;

                label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-weight: 500;
                }

                input,
                select {
                    width: 80%;
                    padding: 0.75rem;
                    border: 1px solid #ced4da;
                    border-radius: 5px;
                    font-size: 1rem;
                }

                input:disabled {
                    background-color: #e9ecef;
                }

                .error-input {
                    border-color: red;
                }

                .error-icon {
                    position: absolute;
                    top: 45%;
                    right: 10px;
                    color: red;
                }

                .error-container {
                    position: relative;
                    height: 10px;

                    .error-message {
                        color: red;
                        font-size: 0.75rem;
                        margin-top: 0.25rem;
                    }
                }
            }
        }
    }

    .search-products {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1.5rem;

        .search-wrapper {
            width: 100%;
            max-width: 500px;
        }

        input[type='text'] {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #ced4da;
            border-radius: 5px;
            font-size: 1rem;
        }

        .product-results {
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            max-width: 500px;
            background-color: white;
            border: 1px solid #dee2e6;
            border-radius: 0 0 5px 5px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            max-height: 300px;
            overflow-y: auto;
            z-index: 10;

            li {
                display: flex;
                align-items: center;
                padding: 0.75rem;
                cursor: pointer;
                transition: background-color 0.2s;

                &:hover {
                    background-color: #f1f3f5;
                }

                img {
                    width: 50px;
                    height: 50px;
                    object-fit: cover;
                    margin-right: 1rem;
                    border-radius: 5px;
                }

                .product-info {
                    flex: 1;

                    h4 {
                        margin: 0;
                        font-size: 1rem;
                        font-weight: 500;
                    }

                    p {
                        margin: 0.25rem 0;
                        font-size: 0.9rem;
                        color: #6c757d;
                    }

                    .price {
                        font-weight: bold;
                        color: #28a745;
                    }
                }

                button {
                    padding: 0.5rem 1rem;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: background-color 0.2s;

                    &:hover {
                        background-color: #0056b3;
                    }
                }
            }
        }
    }

    .product-table {
        width: 100%;
        border-collapse: collapse;
        background-color: white;
        border-radius: 5px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

        th,
        td {
            padding: 1rem;
            text-align: left;
            border-bottom: 1px solid #dee2e6;

            &:last-child {
                text-align: center;
            }
        }

        thead {
            background-color: #343a40;
            color: white;
        }

        tbody tr:hover {
            background-color: #f8f9fa;
        }

        input {
            width: 120px;
            padding: 0.5rem;
            border: 1px solid #ced4da;
            border-radius: 5px;
        }

        .remove-product-button {
            background: none;
            border: none;
            cursor: pointer;
            color: #dc3545;
            font-size: 1.25rem;

            &:hover {
                color: #bd2130;
            }
        }

        .error-input {
            border-color: red;
        }

    }
}
</style>