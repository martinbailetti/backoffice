
import React, { memo } from "react";

const AuthWaiting = () => {
  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center">
      <div className="loader"></div>
    </div>
  );
};

export default memo(AuthWaiting);
