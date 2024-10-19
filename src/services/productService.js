import { ref } from 'vue'
import { validateField, validationRules } from './validationService';
import { showDeleteConfirmation } from './confirmDialog';

class ProductService {
  constructor() {
    this.items = ref([]);
    this.item = ref({});
  }

  //Get all Posts
  async getAll() {
    try {
      const response = await axios.get("/items");
      this.items.value = response.data.items.data;
      return this.items.value;
    } catch (error) {
      console.log(error);
    }
  }

  // Mapeo los nombres de los campos a un texto amigable
  getFieldLabel(field) {
    const fieldLabels = {
      codigo: 'Código',
      nombre: 'Nombre',
      descripcion: 'Descripción',
      imagen: 'Imagen',
      tipo: 'Tipo',
      iva_compra: 'IVA de compra',
      iva_venta: 'IVA de venta',
      precio: 'Precio',
      categoria: 'Categoría',
      lots: 'Lotes',
      'lots.numero': 'Número de Lote',
      'lots.fecha_vencimiento': 'Fecha de Vencimiento',
    };
    return fieldLabels[field] || field;
  }

  validateData(data) {
    const errors = {};

    // Reglas de validación específicas para cada campo
    const rules = {
      codigo: [
        validationRules.required(),
        validationRules.lengthBetween(3, 10),
        validationRules.unique('codigo', this.items.value, null, null, data.id),
      ],
      nombre: [
        validationRules.required(),
        validationRules.lengthBetween(3, 100),
      ],
      descripcion: [
        validationRules.optional(),
        validationRules.maxLength(500),
      ],
      imagen: [
        validationRules.optional(),
      ],
      tipo: [
        validationRules.required(),
      ],
      iva_compra: [
        validationRules.required(),
        validationRules.range(0, 100),
      ],
      iva_venta: [
        validationRules.required(),
        validationRules.range(0, 100),
      ],
      precio: [
        validationRules.required(),
        validationRules.greaterThan(0),
      ],
      categoria: [
        validationRules.optional(),
      ],
      lots: [
        validationRules.optional(), // 'lots' puede ser opcional
      ],
    };

    // Validación de cada campo
    Object.keys(rules).forEach((field) => {
      const error = validateField(
        data[field],
        rules[field],
        { field: this.getFieldLabel(field), min: 3, max: 10 }
      );
      if (error) errors[field] = error;
    });

    // Validación específica para el array de 'lots'
    if (Array.isArray(data.lots) && data.lots.length > 0) {
      data.lots.forEach((lot, index) => {
        const lotErrors = {};
        if (!lot.numero) {
          lotErrors.numero = `${this.getFieldLabel('lots.numero')} es requerido`;
        }
        if (!lot.fecha_vencimiento) {
          lotErrors.fecha_vencimiento = `${this.getFieldLabel('lots.fecha_vencimiento')} es requerida`;
        }
        if (Object.keys(lotErrors).length > 0) {
          errors[`lots_${index}`] = lotErrors;
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

      for (const key in data) {
        if (Array.isArray(data[key])) {
          // Si el campo es un arreglo (como lots), añade cada elemento
          data[key].forEach((lot) => {
            formData.append(`lots[]`, JSON.stringify(lot)); // Serializa el objeto lote
          });
        } else {
          formData.append(key, data[key]);
        }
      }

      // Realiza la solicitud con FormData
      const response = await axios.post('/items', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return { success: true, message: 'Producto creado exitosamente' };
    } catch (error) {
      if (error.response && error.response.status === 422) {
        return { error: true, message: error.response.data.message };
      }
      return { error: true, message: 'Ocurrió un error inesperado' };
    }
  }

  async updateData(data) {
    const productData = { ...data }; // Copia los datos del producto
    const errors = this.validateData(productData);

    if (Object.keys(errors).length > 0) {
      return { success: false, errors };
    }

    // Excluye el campo 'imagen' de productData
    const { imagen, lots, ...dataWithoutImage } = productData;

    const formData = new FormData();
    for (const key in dataWithoutImage) {
      // Añade el campo al FormData tal cual, ya que los campos vacíos se envían como cadenas vacías
      formData.append(key, dataWithoutImage[key] || ''); // Si es falsy (incluido undefined o vacío), se añade como cadena vacía
    }

    if (Array.isArray(lots)) {
      lots.forEach((lot, index) => {
        for (const lotKey in lot) {
          // Agrega cada propiedad del lote al FormData
          formData.append(`lots[${index}][${lotKey}]`, lot[lotKey]);
        }
      });
    }

    try {
      // Actualiza el producto sin el campo imagen
      const response = await axios.put(`/items/${data.id}`, formData);

      // Solo enviar la imagen si ha sido cambiada
      if (imagen && typeof imagen !== 'string') { // Verifica que 'imagen' no sea una cadena (como la URL de la imagen actual)
        const imageFormData = new FormData();
        imageFormData.append('imagen', imagen);

        await axios.post(`/items/${data.id}/imagen`, imageFormData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      return { success: true, message: 'Producto actualizado exitosamente' };
    } catch (error) {
      if (error.response && error.response.status === 422) {
        return { error: true, message: error.response.data.message };
      }
      return { error: true, message: 'Ocurrió un error inesperado' };
    }
  }


  async deleteItem(id, name) {
    const confirmed = await showDeleteConfirmation('Producto', name);

    if (!confirmed) {
      return { success: false, message: 'Eliminación cancelada' };
    }

    try {
      await axios.delete(`/items/${id}`);

      return { success: true, message: 'Producto eliminado exitosamente' };
    } catch (error) {
      if (error.response && error.response.status === 422) {
        return { error: true, message: error.response.data.message };
      }
      return { error: true, message: 'Ocurrió un error inesperado' };
    }
  }
}

export default ProductService;
