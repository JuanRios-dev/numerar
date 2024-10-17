import Swal from 'sweetalert2';

const swalWithBootstrapButtons = Swal.mixin({
  buttonsStyling: true
});

export const showDeleteConfirmation = async (itemName, tableName) => {
  const result = await swalWithBootstrapButtons.fire({
    title: `¿Eliminar ${itemName}?`,
    text: `Perderás toda la información relacionada a '${tableName}'.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true
  });

  if (result.isConfirmed) {
    return true;
  } else if (result.dismiss === Swal.DismissReason.cancel) {
    await swalWithBootstrapButtons.fire({
      title: 'Cancelado',
      text: `El ${itemName} está a salvo.`,
      icon: 'error'
    });
    return false;
  }
};
