import { ref } from 'vue'
import { validateField, validationRules } from './validationService';
import { showSuccessMessage } from './confirmDialog';
import { useRouter } from 'vue-router';

class MovementService {
  constructor() {
    this.movements = ref([]);
    this.movement = ref({});
    this.router = useRouter();
  }

  async getAll() {
    try {
      const response = await axios.get("/movements");
      this.movements.value = response.data.movements;
      return this.movements.value;
    } catch (error) {
      console.log(error);
    }
  }

  getFieldLabel(field) {
    const fieldLabels = {
      fecha: 'Fecha',
      tipo: 'Tipo',
      detalles: 'Detalles',
      total: 'Total',
      products: 'Productos',
      'products.cantidad': 'Cantidad',
      'products.costo_unitario': 'Costo Unitario',
      'products.costo_total': 'Costo Total',
    };
    return fieldLabels[field] || field;
  }

  validateData(data) {
    const errors = {};

    const rules = {
      fecha: [
        validationRules.required(),
      ],
      tipo: [
        validationRules.required(),
      ],
      detalles: [
        validationRules.required(),
        validationRules.maxLength(50),
      ],
      total: [
        validationRules.required(),
        validationRules.greaterThan(0),
      ],
      products: [
        validationRules.required(),
      ],
    };

    // Validación de cada campo de movimiento
    Object.keys(rules).forEach((field) => {
      const error = validateField(
        data[field],
        rules[field],
        { field: this.getFieldLabel(field) }
      );
      if (error) errors[field] = error;
    });

    // Validación específica para el array de 'products'
    if (Array.isArray(data.products) && data.products.length > 0) {
      data.products.forEach((product, index) => {
        const productErrors = {};
        if (!product.cantidad || product.cantidad <= 0) {
          productErrors.cantidad = `${this.getFieldLabel('products.cantidad')} debe ser mayor que 0`;
        }
        if (!product.costo_unitario || product.costo_unitario <= 0) {
          productErrors.costo_unitario = `${this.getFieldLabel('products.costo_unitario')} debe ser mayor que 0`;
        }
        if (!product.costo_total || product.costo_total <= 0) {
          productErrors.costo_total = `${this.getFieldLabel('products.costo_total')} debe ser mayor que 0`;
        }
        if (Object.keys(productErrors).length > 0) {
          errors[`products_${index}`] = productErrors;
        }
      });
    }

    return errors;
  }

  async saveData(data) {
    const errors = this.validateData(data);

    if (Object.keys(errors).length > 0) {
      return { success: false, errors };
    }

    try {
      const formData = new FormData();

      if (Array.isArray(data.products)) {
        data.products.forEach((product, index) => {
          const itemData = {
            item_id: product.id,
            cantidad: product.cantidad,
            costo_unitario: product.costo_unitario,
            costo_total: product.costo_total,
            lot_id: product.lot_id,
          };

          for (const key in itemData) {
            const value = itemData[key] === null ? '' : itemData[key];
            formData.append(`items[${index}][${key}]`, value);
          }
        });
      }

      for (const key in data) {
        if (key !== 'products') {
          const value = data[key] === null ? '' : data[key];
          formData.append(key, value);
        }
      }

      const response = await axios.post('/movements', formData);

      await showSuccessMessage('Éxito', 'Movimiento creado exitosamente');

      this.router.push('/movements');
      return { success: true, message: 'Movimiento creado exitosamente' };
    } catch (error) {
      if (error.response && error.response.status === 422) {
        return { error: true, message: error.response.data.message };
      }
      return { error: true, message: 'Ocurrió un error inesperado' };
    }
  }
}

export default MovementService;
