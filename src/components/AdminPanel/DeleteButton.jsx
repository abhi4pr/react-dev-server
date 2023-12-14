import Swal from "sweetalert2";
import axios from "axios";
import { MdDelete } from "react-icons/md";

const DeleteButton = ({ endpoint, id, getData }) => {
  const handleDelete = () => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`http://34.93.221.166:3000/api/${endpoint}/${id}`)
            .then(() => {
              // Check if no error occurred and then show the success alert
              swalWithBootstrapButtons.fire(
                "Deleted!",
                "Your file has been deleted.",
                "success"
              );
              getData();
            })
            .catch(() => {
              showErrorAlert();
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Cancelled",
            "Your imaginary file is safe :)"
          );
        }
      });
  };

  const showErrorAlert = () => {
    Swal.fire(
      "Error",
      "You can't delete this user. You should have super admin permissions.",
      "error"
    );
  };

  return (
    <button
      title="Delete"
      className="btn btn-outline-danger btn-sml user-button"
      onClick={handleDelete}
    >
      <i className="bi bi-trash3"></i>
    </button>
  );
};

export default DeleteButton;
