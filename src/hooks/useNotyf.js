import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const useNotyf = () => {
  const notyf = new Notyf({
    position: {
      x: "right",
      y: "bottom",
    },
  });

  const showSuccessNotification = (message) => {
    notyf.open({
      message,
      duration: 2000,
      className: "custom-gradient-success",
    });
  };

  const showErrorNotification = (message) => {
    notyf.open({
      message,
      duration: 2000,
      className: "custom-gradient-error",
    });
  };

  return { showSuccessNotification, showErrorNotification };
};

export default useNotyf;
