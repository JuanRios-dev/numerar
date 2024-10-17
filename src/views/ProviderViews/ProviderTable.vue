<template>
    <MainLayout>
        <h1>Listado de Proveedores</h1>

        <Alert v-if="alertMessage" :message="alertMessage" :type="alertType" @click="alertMessage = ''" />

        <TableData :headers="headers" :data="data" :rowsPerPage="5">
            <template #buttons>
                <Button @click="() => { resetForm(), this.$refs.clientModal.openModal() }" :title="'Agregar Proveedor'"
                    :icon="'IoAddCircleSharp'" :color="'#074F8E'"></Button>
            </template>
            <template #action-buttons="{ element }">
                <CustomButton @click="() => editData(element)" :title="'Editar'" :icon="'BiPencilSquare'"
                    :iconColor="'#000000'" :color="'#FFC107'"></CustomButton>
                <CustomButton @click="() => deleteItem(element.id, element.nombre_razonsocial)" :title="'Eliminar'" :icon="'MdDeleteforever'"
                    :color="'#F44336'"></CustomButton>
            </template>
        </TableData>

        <!-- Modal para Crear Proveedor -->
        <Modal ref="clientModal" width="400px" :title="'Agregar Proveedor'" backgroundColor="#f0f0f0">
            <template #content>
                <ProviderForm :data="form" :errors="errors"></ProviderForm>
            </template>
            <template #footer>
                <Button @click="saveData()" :title="'Guardar Proveedor'" :color="'#074F8E'"
                    :icon="'IoAddCircleSharp'"></Button>
            </template>
        </Modal>

        <!-- Modal para Editar Proveedor -->
        <Modal ref="editModal" width="400px" :title="'Editar Proveedor'" backgroundColor="#f0f0f0">
            <template #content>
                <ProviderForm :data="form" :errors="errors"></ProviderForm>
            </template>
            <template #footer>
                <Button @click="updateData(form.id)" :title="'Actualizar Proveedor'" :color="'#074F8E'"
                    :icon="'IoCreateOutline'"></Button>
            </template>
        </Modal>
    </MainLayout>
</template>

<script>
import MainLayout from '@/layouts/MainLayout.vue'
import TableData from '@/components/TableData.vue'
import providerService from '@/services/providerService'
import ProviderForm from '@/components/Form/ProviderForm.vue'
import Button from '@/components/Button.vue'
import CustomButton from '@/components/CustomButton.vue'
import Modal from '@/components/Modal.vue'
import Alert from '@/components/Alert.vue'

export default {
    name: 'ProviderTable',
    components: {
        MainLayout,
        TableData,
        ProviderForm,
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
                { label: 'Persona', key: 'tipo_persona' },
                { label: 'Tipo', key: 'tipo_documento' },
                { label: 'Documento', key: 'numero_documento' },
                { label: 'Nombre', key: 'nombre_razonsocial' },
                { label: 'Correo', key: 'correo' },
                { label: 'Teléfono', key: 'telefono' },
                { label: 'Ciudad', key: 'ciudad' },
                { label: 'Departamento', key: 'departamento' },
                { label: 'Pais', key: 'pais' },
            ],
            providerService: new providerService(),
            data: [],
            form: {
                id: null,
                tipo_persona: '',
                tipo_documento: '',
                numero_documento: '',
                nombre_razonsocial: '',
                telefono: '',
                correo: '',
                ciudad: '',
                departamento: '',
                pais: '',
                comentarios: '',
                responsable_iva: false,
            },
            errors: {},
            alertMessage: '',
        }
    },
    methods: {
        async fetchData() {
            this.data = await this.providerService.getAll();
        },
        resetForm() {
            this.form = {
                id: null,
                tipo_persona: 'Natural',
                tipo_documento: 'CC',
                numero_documento: '',
                nombre_razonsocial: '',
                telefono: '',
                correo: '',
                ciudad: '',
                departamento: '',
                pais: '',
                comentarios: '',
                responsable_iva: true,
            };
            this.errors = {};
        },
        showAlert(message, type) {
            this.alertMessage = message;
            this.alertType = type;
        },
        async saveData() {
            const result = await this.providerService.saveData(this.form, this.data);

            if (result.success) {
                this.showAlert(result.message, 'success');
                this.data = await this.providerService.getAll();
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
            const result = await this.providerService.updateData(this.form);

            if (result.success) {
                this.$refs.editModal.closeModal();
                this.showAlert(result.message, 'success');
                this.data = await this.providerService.getAll();
                this.resetForm();
            } else if (result.error) {
                this.showAlert(result.message, 'error');
            } else {
                this.errors = result.errors;
            }
        },
        async deleteItem(id, name) {
            const result = await this.providerService.deleteItem(id, name);

            if (result.success) {
                this.data = await this.providerService.getAll();
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
