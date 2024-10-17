<template>
    <MainLayout>
        <h1>Listado de Tiendas</h1>

        <Alert v-if="alertMessage" :message="alertMessage" :type="alertType" @click="alertMessage = ''" />

        <TableData :headers="headers" :data="data" :rowsPerPage="5"></TableData>

        <!-- Modal para Crear Cliente -->
        <Modal ref="clientModal" width="400px" :title="'Agregar Tienda'" backgroundColor="#f0f0f0">
            <template #content>
                <ProviderForm :data="form" :errors="errors"></ProviderForm>
            </template>
            <template #footer>
                <Button @click="saveData()" :title="'Guardar Tienda'" :color="'#074F8E'"
                    :icon="'IoAddCircleSharp'"></Button>
            </template>
        </Modal>

        <!-- Modal para Editar Cliente -->
        <Modal ref="editModal" width="400px" :title="'Editar Tienda'" backgroundColor="#f0f0f0">
            <template #content>
                <ProviderForm :data="form" :errors="errors"></ProviderForm>
            </template>
            <template #footer>
                <Button @click="updateData(form.id)" :title="'Actualizar Tienda'" :color="'#074F8E'"
                    :icon="'IoCreateOutline'"></Button>
            </template>
        </Modal>
    </MainLayout>
</template>

<script>
import MainLayout from '@/layouts/MainLayout.vue'
import TableData from '@/components/TableData.vue'
import companyService from '@/services/companyService'
import ProviderForm from '@/components/Form/ProviderForm.vue'
import Button from '@/components/Button.vue'
import CustomButton from '@/components/CustomButton.vue'
import Modal from '@/components/Modal.vue'
import Alert from '@/components/Alert.vue'

export default {
    name: 'CompanyTable',
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
                { label: 'NIT', key: 'nit' },
                { label: 'Nombre', key: 'nombre' },
                { label: 'Dirección', key: 'direccion' },
                { label: 'Teléfono', key: 'telefono' },
                { label: 'Correo', key: 'correo' },
                { label: 'Pais', key: 'pais' },
                { label: 'Moneda', key: 'moneda' },
                { label: 'Codigo Postal', key: 'codigo_postal' },
            ],
            companyService: new companyService(),
            data: [],
            form: {
                nombre: '',
                direccion: '',
                telefono: '',
                correo: '',
                pais: '',
                moneda: '',
                codigo_postal: '',
            },
            errors: {},
            alertMessage: '',
        }
    },
    methods: {
        async fetchData() {
            this.data = await this.companyService.getAll();
        },
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
