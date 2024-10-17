<template>
    <div class="customer-form">
        <div class="form-group">
            <label for="tipo-persona">Tipo de Persona</label>
            <div class="custom-select">
                <div class="option" :class="{ selected: data.tipo_persona === 'Natural' }" @click="selectType('Natural')">
                    Natural
                </div>
                <div class="option" :class="{ selected: data.tipo_persona === 'Juridica' }" @click="selectType('Juridica')">
                    Juridica
                </div>
            </div>
        </div>
        <div class="form-group">
            <label for="tipo-documento">Tipo de Documento</label>
            <div class="radio-group">
                <label>
                    <input type="radio" id="NIT" value="NIT" v-model="data.tipo_documento">
                    NIT
                </label>
                <label>
                    <input type="radio" id="CC" value="CC" v-model="data.tipo_documento">
                    CC
                </label>
                <label>
                    <input type="radio" id="TI" value="TI" v-model="data.tipo_documento">
                    TI
                </label>
                <label>
                    <input type="radio" id="CE" value="CE" v-model="data.tipo_documento">
                    CE
                </label>
            </div>
        </div>
        <div class="form-group checkbox-group">
            <label>
                <input type="checkbox" v-model="data.responsable_iva">
                Responsable IVA
            </label>
        </div>
        <div class="form-group">
            <label for="documento">Documento</label>
            <v-icon name="md-erroroutline" class="error-icon" v-if="errors.numero_documento"></v-icon>
            <input type="text" id="documento" placeholder="xxxxxxxxxx" v-model="data.numero_documento"
                autocomplete="off" :class="{ 'error-input': errors.numero_documento }" />
            <div class="error-container">
                <span class="error-message" v-if="errors.numero_documento">{{ errors.numero_documento }}</span>
            </div>
        </div>
        <div class="form-group">
            <label for="nombre">Nombre / Razón Social</label>
            <v-icon name="md-erroroutline" class="error-icon" v-if="errors.nombre_razonsocial"></v-icon>
            <input type="text" id="nombre" v-model="data.nombre_razonsocial" autocomplete="off"
                :class="{ 'error-input': errors.nombre_razonsocial }" />
            <div class="error-container">
                <span class="error-message" v-if="errors.nombre_razonsocial">{{ errors.nombre_razonsocial }}</span>
            </div>
        </div>
        <div class="form-group">
            <label for="telefono">Teléfono</label>
            <v-icon name="md-erroroutline" class="error-icon" v-if="errors.telefono"></v-icon>
            <input type="text" id="telefono" placeholder="xxx xxx xxxx" v-model="data.telefono" autocomplete="off"
                :class="{ 'error-input': errors.telefono }" />
            <div class="error-container">
                <span class="error-message" v-if="errors.telefono">{{ errors.telefono }}</span>
            </div>
        </div>
        <div class="form-group">
            <label for="correo">Correo Eléctronico</label>
            <v-icon name="md-erroroutline" class="error-icon" v-if="errors.correo"></v-icon>
            <input type="text" id="correo" placeholder="xxxxxxx@xxxx.xxx" v-model="data.correo" autocomplete="off"
                :class="{ 'error-input': errors.correo }" />
            <div class="error-container">
                <span class="error-message" v-if="errors.correo">{{ errors.correo }}</span>
            </div>
        </div>
        <div class="form-group">
            <label for="direccion">Dirección</label>
            <input type="text" id="direccion" v-model="data.direccion" autocomplete="off" />
        </div>
        <div class="form-group">
            <label for="ciudad">Ciudad</label>
            <input type="text" id="ciudad" v-model="data.ciudad" autocomplete="off" />
        </div>
        <div class="form-group">
            <label for="departamento">Departamento</label>
            <input type="text" id="departamento" v-model="data.departamento" autocomplete="off" />
        </div>
        <div class="form-group">
            <label for="Pais">Pais</label>
            <input type="text" id="Pais" v-model="data.pais" autocomplete="off" />
        </div>
        <div class="form-group">
            <label for="comentarios">Comentarios</label>
            <textarea type="text" id="comentarios" v-model="data.comentarios" autocomplete="off" />
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import { addIcons } from 'oh-vue-icons';
import { MdErroroutline } from 'oh-vue-icons/icons'

addIcons(MdErroroutline)

export default defineComponent({
    name: 'CustomerForm',
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
    setup(props) {

        const selectType = (type) => {
            props.data.tipo_persona = type;
        }

        return {
            selectType
        }
    }
})
</script>

<style lang="scss" scoped>
.customer-form {
    .form-group {
        margin-bottom: 20px;
        display: flex;
        flex-direction: column;
        position: relative;

        label {
            display: block;
            margin-bottom: 5px;
        }

        input {
            padding: 0.5rem 8px;
            font-size: 14px;
            outline: none;
            border: 1px solid #ccc;
            transition: border-color 0.1s ease-in-out;

            &:focus {
                border-color: $primary-color;
            }
        }

        .checkbox-group {
            display: flex;
            align-items: center;

            input[type="checkbox"] {
                margin-right: 10px;
            }
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

        textarea {
            min-height: 60px;
            max-height: 120px;

            padding: 8px;
            font-size: 14px;
            border: 1px solid #ccc;
            resize: vertical;
            outline: none;
            transition: border-color 0.1s ease-in-out;

            &:focus {
                border-color: $primary-color;
            }
        }

        .radio-group {
            display: flex;
            justify-content: start;
            gap: 10px;

            .radio-option input[type="radio"] {
                margin-right: 5px;
            }
        }
    }

    .custom-select {
        display: flex;
        gap: 10px;

        .option {
            background: #fff;
            border: 1px solid #ccc;
            padding: 0.5rem;
            cursor: pointer;
            text-align: center;
            flex: 1;

            &.selected {
                background: $primary-color;
                color: #fff;
                border-color: $gray;
            }
        }
    }

    button {
        padding: 0.5rem 1rem;
        background: #007bff;
        border: none;
        color: #fff;
        cursor: pointer;

        &:hover {
            background: #0056b3;
        }
    }
}
</style>
