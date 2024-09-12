import Swal from "sweetalert2";

export const showDeleteConfirmation = (operator) => {
  return Swal.fire({
    title: ` ${operator}, Are you sure?`,
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "No, cancel!",
    customClass: {
      confirmButton: "swal-confirm-btn",
      cancelButton: "swal-cancel-btn",
    },
  });
};
