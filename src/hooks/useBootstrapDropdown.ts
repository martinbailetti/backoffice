import { useEffect } from 'react';
const useBootstrapDropdpown = () => {

  useEffect(() => {
    import("../../public/js/bootstrap.bundle.min.js");
    const bootstrap = require("bootstrap"); // eslint-disable-line

    // Inicializa todos los dropdowns en la página
    const dropdownTriggerList = Array.from(
      document.querySelectorAll('[data-bs-toggle="dropdown"]'),
    );
    const dropdownList = dropdownTriggerList.map(
      (dropdownTriggerEl) => new bootstrap.Dropdown(dropdownTriggerEl),
    );

    return () => {
      // Limpia las instancias de dropdown al desmontar el componente
      dropdownList.forEach((dropdown) => dropdown.dispose());
    };
  }, []);
};

export default useBootstrapDropdpown;
