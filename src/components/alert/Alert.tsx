import React, { memo, useEffect } from "react";

/**
 * Alert component.
 */

const Alert = ({
  message,
  type = "danger",
  closeAlert,
}: {
  message: string;
  type?: "danger" | "primary" | "success" | "info" | "secondary" | "warning";
  closeAlert: () => void;
}) => {

  useEffect(() => {
    const timer = setTimeout(() => {
      closeAlert();
    }, 3000);

    // Limpia el timeout si el componente se desmonta antes de que se complete el timeout
    return () => {clearTimeout(timer)};
  }, [closeAlert]);

  return (
    <>
      {message && (
        <div onClick={closeAlert}
          className={`fixed-bottom mb-0 d-flex justify-content-between alert alert-${type} fade show`}
        >
          {message}
          <button type="button" className="btn-close"></button>
        </div>
      )}
    </>
  );
};
export default memo(Alert);
