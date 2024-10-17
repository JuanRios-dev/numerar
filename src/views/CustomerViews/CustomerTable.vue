<template>
    <MainLayout>
        <h1>Listado de Clientes</h1>

        <Alert v-if="alertMessage" :message="alertMessage" :type="alertType" @click="alertMessage = ''" />

        <TableData :headers="headers" :data="customers" :rowsPerPage="5">
            <template #buttons>
                <Button @click="() => { resetForm(), this.$refs.clientModal.openModal() }" :title="'Agregar Cliente'"
                    :icon="'IoAddCircleSharp'" :color="'#074F8E'"></Button>
            </template>
            <template #action-buttons="{ element }">
                <CustomButton @click="() => editCustomer(element)" :title="'Editar'" :icon="'BiPencilSquare'"
                    :iconColor="'#000000'" :color="'#FFC107'"></CustomButton>
                <CustomButton @click="() => deleteCustomer(element.id, element.nombre_razonsocial)" :title="'Eliminar'" :icon="'MdDeleteforever'"
                    :color="'#F44336'"></CustomButton>
            </template>
        </TableData>

        <!-- Modal para Crear Cliente -->
        <Modal ref="clientModal" width="400px" :title="'Agregar Cliente'" backgroundColor="#f0f0f0">
            <template #content>
                <CustomerForm :data="form" :errors="errors"></CustomerForm>
            </template>
            <template #footer>
                <Button @click="saveCustomer()" :title="'Guardar Cliente'" :color="'#074F8E'"
                    :icon="'IoAddCircleSharp'"></Button>
            </template>
        </Modal>

        <!-- Modal para Editar Cliente -->
        <Modal ref="editCustomerModal" width="400px" :title="'Editar Cliente'" backgroundColor="#f0f0f0">
            <template #content>
                <CustomerForm :data="form" :errors="errors"></CustomerForm>
            </template>
            <template #footer>
                <Button @click="updateCustomer(form.id)" :title="'Actualizar Cliente'" :color="'#074F8E'"
                    :icon="'IoCreateOutline'"></Button>
            </template>
        </Modal>
    </MainLayout>
</template>

<script>
import MainLayout from '@/layouts/MainLayout.vue'
import TableData from '@/components/TableData.vue'
import CustomerService from '@/services/customerService'
import CustomerForm from '@/components/Form/CustomerForm.vue'
import Button from '@/components/Button.vue'
import CustomButton from '@/components/CustomButton.vue'
import Modal from '@/components/Modal.vue'
import Alert from '@/components/Alert.vue'

export default {
    name: 'CustomerTable',
    components: {
        MainLayout,
        TableData,
        CustomerForm,
        Button,
        Modal,
        CustomButton,
        Alert
    },
    data() {
        return {
            clientModal: null,
            editCustomerModal: null,
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
            customerService: new CustomerService(),
            customers: [],
            form: {
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
            },
            errors: {},
            alertMessage: '',
        }
    },
    methods: {
        async fetchCustomers() {
            this.customers = await this.customerService.getAll(); // Obtener todos los clientes
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
            };
            this.errors = {};
        },
        showAlert(message, type) {
            this.alertMessage = message;
            this.alertType = type;
        },
        async saveCustomer() {
            const result = await this.customerService.saveCustomer(this.form, this.customers);

            if (result.success) {
                this.showAlert(result.message, 'success');
                this.customers = await this.customerService.getAll();
                this.$refs.clientModal.closeModal();
                this.resetForm();
            } else if (result.error) {
                this.showAlert(result.message, 'error');
            } else {
                this.errors = result.errors;
            }
        },
        editCustomer(customer) {
            this.form = { ...customer };
            this.errors = '';
            this.$refs.editCustomerModal.openModal();
        },
        async updateCustomer() {
            const result = await this.customerService.updateCustomer(this.form); // Lógica de actualización

            if (result.success) {
                this.$refs.editCustomerModal.closeModal();
                this.showAlert(result.message, 'success');
                this.customers = await this.customerService.getAll();
                this.resetForm();
            } else if (result.error) {
                this.showAlert(result.message, 'error');
            } else {
                this.errors = result.errors;
            }
        },
        async deleteCustomer(customerId, customerName) {
            const result = await this.customerService.deleteCustomer(customerId, customerName); // Pasamos el nombre del cliente

            if (result.success) {
                this.customers = await this.customerService.getAll();
                this.showAlert(result.message, 'success');
            } else if (result.error) {
                this.showAlert(result.message, 'error');
            }
        }
    },
    mounted() {
        this.fetchCustomers();
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
