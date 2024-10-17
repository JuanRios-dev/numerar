import { ref } from 'vue'
import { validateField, validationRules } from './validationService';
import { showDeleteConfirmation } from './confirmDialog';

class CompanyService {
  constructor() {
    this.companies = ref([]);
    this.company = ref({});
  }

  //Get all Posts
  async getAll() {
    try {
      const response = await axios.get("/companies");
      this.companies.value = response.data.companies.data;
      return this.companies.value;
    } catch (error) {
      console.log(error);
    }
  }

  // Mapeo los nombres de los campos a un texto amigable
  getFieldLabel(field) {
    const fieldLabels = {
      numero_documento: 'Número de documento',
      nombre_razonsocial: 'Nombre/Razón Social',
      telefono: 'Número de teléfono',
      correo: 'Correo electrónico',
    };
    return fieldLabels[field] || field;
  }

  validateData(data) {
    const errors = {};

    // Reglas de validación específicas para cada campo
    const rules = {
      numero_documento: [
        validationRules.required(),
        validationRules.alphaNumericHyphen(),
        validationRules.lengthBetween(7, 15),
        validationRules.unique('numero_documento', this.companies.value, 'tipo_persona', data.tipo_persona, data.id),
      ],
      nombre_razonsocial: [
        validationRules.required(),
      ],
      telefono: [
        validationRules.required(),
        validationRules.numeric(),
        validationRules.unique('telefono', this.companies.value, null, null, data.id),
      ],
      correo: [
        validationRules.email(),
        validationRules.unique('correo', this.companies.value, null, null, data.id),
      ],
    };

    // Validación de cada campo
    Object.keys(rules).forEach((field) => {
      const error = validateField(
        data[field],
        rules[field],
        { field: this.getFieldLabel(field), min: 7, max: 15 } // Personaliza los mensajes
      );
      if (error) errors[field] = error;
    });

    return errors;
  }

  //METODOS
  async saveData(data) {
    const errors = this.validateData(data);

    if (Object.keys(errors).length > 0) {
      return { success: false, errors };
    }

    try {
      const response = await axios.post('/companies', data);

      return { success: true, message: 'Compañia creado exitosamente' };
    } catch (error) {
      if (error.response && error.response.status === 422) {
        return { error: true, message: error.response.data.message };
      }

      return { error: true, message: 'Ocurrió un error inesperado' };
    }
  }

  async updateData(data) {
    const errors = this.validateData(data);

    if (Object.keys(errors).length > 0) {
      return { success: false, errors };
    }

    try {
      const response = await axios.put(`/companies/${data.id}`, data);
      return { success: true, message: 'Compañia actualizado exitosamente' };
    } catch (error) {
      if (error.response && error.response.status === 422) {
        return { error: true, message: error.response.data.message };
      }

      return { error: true, message: 'Ocurrió un error inesperado' };
    }
  }

  async deleteItem(id, name) {
    const confirmed = await showDeleteConfirmation('Compañia', name);

    if (!confirmed) {
      return { success: false, message: 'Eliminación cancelada' };
    }

    try {
      await axios.delete(`/companies/${id}`);

      return { success: true, message: 'Compañia eliminado exitosamente' };
    } catch (error) {
      if (error.response && error.response.status === 422) {
        return { error: true, message: error.response.data.message };
      }
      return { error: true, message: 'Ocurrió un error inesperado' };
    }
  }
}

export default CompanyService;
