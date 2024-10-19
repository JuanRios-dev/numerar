<template>
    <div class="item-form">
        <div class="form-group">
            <label for="codigo">Código</label>
            <v-icon name="md-erroroutline" class="error-icon" v-if="errors.codigo"></v-icon>
            <input type="text" id="codigo" v-model="data.codigo" autocomplete="off"
                :class="{ 'error-input': errors.codigo }" />
            <div class="error-container">
                <span class="error-message" v-if="errors.codigo">{{ errors.codigo }}</span>
            </div>
        </div>

        <div class="form-group">
            <label for="nombre">Nombre</label>
            <v-icon name="md-erroroutline" class="error-icon" v-if="errors.nombre"></v-icon>
            <input type="text" id="nombre" v-model="data.nombre" autocomplete="off"
                :class="{ 'error-input': errors.nombre }" />
            <div class="error-container">
                <span class="error-message" v-if="errors.nombre">{{ errors.nombre }}</span>
            </div>
        </div>

        <div class="form-group">
            <label for="descripcion">Descripción</label>
            <textarea id="descripcion" v-model="data.descripcion" autocomplete="off"></textarea>
        </div>

        <div class="form-group">
            <label for="imagen">Imagen</label>
            <!-- Mostrar la imagen actual si ya existe -->
            <div v-if="data.imagen && !imagePreview">
                <img :src="`https://app.alernal.com.co/${data.imagen}`" alt="Imagen del producto"
                    class="preview-image" />
            </div>
            <!-- Mostrar la imagen seleccionada desde el local -->
            <div v-if="imagePreview">
                <img :src="imagePreview" alt="Imagen seleccionada" class="preview-image" />
            </div>
            <input type="file" id="imagen" accept=".jpeg, .jpg, .png" @change="onFileChange" />
            <div class="error-container">
                <span class="error-message" v-if="errors.imagen">{{ errors.imagen }}</span>
            </div>
        </div>

        <div class="form-group">
            <label for="tipo">Tipo</label>
            <select v-model="data.tipo" id="tipo">
                <option value="Inventariable">Inventariable</option>
                <option value="No Inventariable">No Inventariable</option>
                <option value="Servicio">Servicio</option>
            </select>
        </div>

        <div class="form-group">
            <label for="iva-compra">IVA Compra (%)</label>
            <select id="iva-compra" v-model="data.iva_compra" autocomplete="off">
                <option value="0.00">0%</option>
                <option value="5.00">5%</option>
                <option value="19.00">19%</option>
            </select>
        </div>

        <div class="form-group">
            <label for="iva-venta">IVA Venta (%)</label>
            <select id="iva-venta" v-model="data.iva_venta" autocomplete="off">
                <option value="0.00">0%</option>
                <option value="5.00">5%</option>
                <option value="19.00">19%</option>
            </select>
        </div>

        <div class="form-group">
            <label for="precio">Precio</label>
            <input type="number" id="precio" v-model.number="data.precio" autocomplete="off"
                :class="{ 'error-input': errors.precio }" min="0" step="0.01" />
            <div class="error-container">
                <span class="error-message" v-if="errors.precio">{{ errors.precio }}</span>
            </div>
        </div>

        <div class="form-group">
            <label for="categoria">Categoría</label>
            <input type="text" id="categoria" v-model="data.categoria" autocomplete="off" />
        </div>

        <button @click="addLot" class="add-lot-button">Agregar Lote</button>
        <table class="lot-table" v-if="data.lots.length">
            <thead>
                <tr>
                    <th>Número</th>
                    <th>Fecha de Vencimiento</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(lot, index) in data.lots" :key="index">
                    <td>
                        <input type="text" v-model="lot.numero" placeholder="Número de lote"
                            :class="{ 'error-input': errors[`lots_${index}`] && errors[`lots_${index}`].numero }" />
                        <div class="error-container">
                            <span class="error-message"
                                v-if="errors[`lots_${index}`] && errors[`lots_${index}`].numero">
                                {{ errors[`lots_${index}`].numero }}
                            </span>
                        </div>
                    </td>
                    <td>
                        <input type="date" v-model="lot.fecha_vencimiento"
                            :class="{ 'error-input': errors[`lots_${index}`] && errors[`lots_${index}`].fecha_vencimiento }" />
                        <div class="error-container">
                            <span class="error-message"
                                v-if="errors[`lots_${index}`] && errors[`lots_${index}`].fecha_vencimiento">
                                {{ errors[`lots_${index}`].fecha_vencimiento }}
                            </span>
                        </div>
                    </td>
                    <td>
                        <button @click="removeLot(lot, index)" class="remove-lot-button"><v-icon name="ri-delete-back-2-fill" class="icon" /></button>
                    </td>
                </tr>
            </tbody>
        </table>

        <div v-if="data.lots.length === 0" class="no-lots-message">No se han agregado lotes.</div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import { addIcons } from 'oh-vue-icons';
import { MdErroroutline, RiDeleteBack2Fill } from 'oh-vue-icons/icons';

addIcons(MdErroroutline, RiDeleteBack2Fill);

export default defineComponent({
    name: 'ItemForm',
    props: {
        data: {
            type: Object,
            required: true
        },
        errors: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            imagePreview: null,
        };
    },
    methods: {
        onFileChange(event) {
            const file = event.target.files[0];
            if (file) {
                this.imagePreview = URL.createObjectURL(file); // Muestra la imagen seleccionada
                this.data.imagen = file; // Guarda el archivo para su uso posterior
                this.$emit('image-uploaded', file); // Emitir evento si deseas manejarlo en el padre
            } else {
                this.imagePreview = null; // Resetea la vista previa si no hay archivo
            }
        },
        addLot() {
            this.data.lots.push({ numero: '', fecha_vencimiento: '' }); // Agrega un nuevo lote
        },
        async removeLot(lot, index) {
            // Si el lote tiene un ID, significa que está guardado en la base de datos
            if (lot.id) {
                try {
                    await axios.delete(`/lots/${lot.id}`);
                    this.data.lots.splice(index, 1);
                } catch (error) {
                    console.error('Error al eliminar el lote:', error);
                }
            } else {
                this.data.lots.splice(index, 1);
            }
        }
    }
});

</script>

<style lang="scss" scoped>
.item-form {

    .add-lot-button {
        margin-top: 20px;
        padding: 0.5rem 1rem;
        background: #007bff;
        border: none;
        color: white;
        cursor: pointer;

        &:hover {
            background: #0056b3;
        }
    }

    .lot-table {
        margin-top: 10px;
        width: 100%;
        border-collapse: collapse;

        th,
        td {
            border: 1px solid #ccc;
            padding: 8px;
            text-align: left;
        }

        th {
            background-color: #f2f2f2;
        }

        .error-input {
            border-color: red;
        }

        .error-message {
            color: red;
            font-size: 0.75rem;
            margin-top: 0.25rem;
        }
    }

    .no-lots-message {
        margin-top: 10px;
        color: #666;
    }

    .form-group {
        margin-bottom: 20px;
        display: flex;
        flex-direction: column;
        position: relative;

        .preview-image {
            margin-bottom: 10px; // Espacio entre la imagen y el campo de archivo
            width: 100px; // Ajusta el tamaño de la imagen
            height: auto; // Mantener la proporción
        }

        label {
            margin-bottom: 5px;
        }

        input,
        select,
        textarea {
            padding: 0.5rem 8px;
            font-size: 14px;
            border: 1px solid #ccc;
            transition: border-color 0.1s ease-in-out;

            &:focus {
                border-color: #007bff;
            }
        }

        .error-input {
            border-color: red;
        }

        .error-icon {
            position: absolute;
            top: 50%;
            right: 10px;
            color: red;
            transform: translateY(-50%);
        }

        .error-container {
            height: 10px;

            .error-message {
                color: red;
                font-size: 0.75rem;
                margin-top: 0.25rem;
            }
        }

        textarea {
            min-height: 60px;
            resize: vertical;
        }
    }

    button {
        padding: 0.5rem 1rem;
        background: #007bff;
        border: none;
        color: white;
        cursor: pointer;

        &:hover {
            background: #0056b3;
        }
    }
}
</style>
