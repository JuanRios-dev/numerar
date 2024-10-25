<template>
    <MainLayout>
        <h1>Listado de Movimientos</h1>

        <Alert v-if="alertMessage" :message="alertMessage" :type="alertType" @click="alertMessage = ''" />

        <TableData :headers="headers" :data="formattedData" :rowsPerPage="5">
            <template #buttons>
                <Button @click="() => { this.$router.push('/movements/create') }" :title="'Agregar Producto'"
                    :icon="'IoAddCircleSharp'" :color="'#074F8E'"></Button>
            </template>
            <template #action-buttons="{ element }">
            </template>
        </TableData>
    </MainLayout>
</template>

<script>
import MainLayout from '@/layouts/MainLayout.vue'
import TableData from '@/components/TableData.vue'
import movementService from '@/services/movementService'
import Button from '@/components/Button.vue'
import CustomButton from '@/components/CustomButton.vue'
import Modal from '@/components/Modal.vue'
import Alert from '@/components/Alert.vue'

export default {
    name: 'ProductTable',
    components: {
        MainLayout,
        TableData,
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
                { label: 'Fecha', key: 'fecha' },
                { label: 'Tipo', key: 'tipo' },
                { label: 'Total', key: 'total' },
                { label: 'Detalles', key: 'detalles' },
            ],
            movementService: new movementService(),
            data: [],
            errors: {},
            alertMessage: '',
        }
    },
    computed: {
        formattedData() {
            return this.data.map(item => ({
                ...item,
                tipo: item.tipo === 1 ? 'Entrada' : 'Salida'
            }));
        }
    },
    methods: {
        async fetchData() {
            this.data = await this.movementService.getAll();
        },
        showAlert(message, type) {
            this.alertMessage = message;
            this.alertType = type;
        },
        async deleteItem(id, name) {
            const result = await this.movementService.deleteItem(id, name);

            if (result.success) {
                this.data = await this.movementService.getAll();
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
