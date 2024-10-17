<template>
    <MainLayout>
        <h1>Listado de Productos</h1>

        <Alert v-if="alertMessage" :message="alertMessage" :type="alertType" @click="alertMessage = ''" />

        <TableData :headers="headers" :data="data" :rowsPerPage="5">
            <template #buttons>
                <Button @click="() => { resetForm(), this.$refs.clientModal.openModal() }" :title="'Agregar Producto'"
                    :icon="'IoAddCircleSharp'" :color="'#074F8E'"></Button>
            </template>
            <template #action-buttons="{ element }">
                <CustomButton @click="() => editData(element)" :title="'Editar'" :icon="'BiPencilSquare'"
                    :iconColor="'#000000'" :color="'#FFC107'"></CustomButton>
                <CustomButton @click="() => deleteItem(element.id, element.nombre)" :title="'Eliminar'"
                    :icon="'MdDeleteforever'" :color="'#F44336'"></CustomButton>
            </template>
        </TableData>

        <!-- Modal para Crear -->
        <Modal ref="clientModal" width="400px" :title="'Agregar Producto'" backgroundColor="#f0f0f0">
            <template #content>
                <ProductForm :data="form" :errors="errors"></ProductForm>
            </template>
            <template #footer>
                <Button @click="saveData()" :title="'Guardar Producto'" :color="'#074F8E'"
                    :icon="'IoAddCircleSharp'"></Button>
            </template>
        </Modal>

        <!-- Modal para Editar -->
        <Modal ref="editModal" width="400px" :title="'Editar Producto'" backgroundColor="#f0f0f0">
            <template #content>
                <ProductForm :data="form" :errors="errors"></ProductForm>
            </template>
            <template #footer>
                <Button @click="updateData(form.id)" :title="'Actualizar Producto'" :color="'#074F8E'"
                    :icon="'IoCreateOutline'"></Button>
            </template>
        </Modal>
    </MainLayout>
</template>

<script>
import MainLayout from '@/layouts/MainLayout.vue'
import TableData from '@/components/TableData.vue'
import productService from '@/services/productService'
import ProductForm from '@/components/Form/ProductForm.vue'
import Button from '@/components/Button.vue'
import CustomButton from '@/components/CustomButton.vue'
import Modal from '@/components/Modal.vue'
import Alert from '@/components/Alert.vue'

export default {
    name: 'ProductTable',
    components: {
        MainLayout,
        TableData,
        ProductForm,
        Button,
        Modal,
        CustomButton,
        Alert
    },
    data() {
        return {
            clientModal: null,
            editModal: null,
            headers: [
                { label: 'Codigo', key: 'codigo' },
                { label: 'Nombre', key: 'nombre' },
                { label: 'Tipo', key: 'tipo' },
                { label: 'Precio', key: 'precio' },
                { label: 'Cantidad', key: 'cantidad_total' },
                { label: 'Categoria', key: 'categoria' },
            ],
            productService: new productService(),
            data: [],
            form: {},
            errors: {},
            alertMessage: '',
        }
    },
    methods: {
        async fetchData() {
            this.data = await this.productService.getAll();
        },
        resetForm() {
            this.form = {
                codigo: '',
                nombre: '',
                descripcion: '',
                imagen: '',
                tipo: 'Inventariable',
                iva_compra: '19.00',
                iva_venta: '19.00',
                precio: '',
                categoria: '',
            };
            this.errors = {};
        },
        showAlert(message, type) {
            this.alertMessage = message;
            this.alertType = type;
        },
        async saveData() {
            const result = await this.productService.saveData(this.form, this.data);

            if (result.success) {
                this.showAlert(result.message, 'success');
                this.data = await this.productService.getAll();
                this.$refs.clientModal.closeModal();
                this.resetForm();
            } else if (result.error) {
                this.showAlert(result.message, 'error');
            } else {
                this.errors = result.errors;
            }
        },
        editData(data) {
            this.form = { ...data };
            this.errors = '';
            this.$refs.editModal.openModal();
        },
        async updateData() {
            const result = await this.productService.updateData(this.form);

            if (result.success) {
                this.showAlert(result.message, 'success');
                this.data = await this.productService.getAll();
                this.$refs.editModal.closeModal();
                this.resetForm();
            } else if (result.error) {
                this.showAlert(result.message, 'error');
            } else {
                this.errors = result.errors;
            }
        },
        async deleteItem(id, name) {
            const result = await this.productService.deleteItem(id, name);

            if (result.success) {
                this.data = await this.productService.getAll();
                this.showAlert(result.message, 'success');
            } else if (result.error) {
                this.showAlert(result.message, 'error');
            }
        }
    },
    mounted() {
        this.fetchData();
    }
}
</script>

<style lang="scss" scoped>
h1 {
    margin: 0;
    margin-bottom: 20px;
    font-size: 1.5rem;
    font-weight: 400;
}
</style>
