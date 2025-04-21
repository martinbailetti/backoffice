import React, { memo } from "react";

import ModalComponent from "../modal/ModalComponent";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setError } from "@/slices/pageSlice";

/**
 * Filters component.
 */

const ErrorModal = () => {
  const pageDataError = useAppSelector((state) => state.pageData.error);
  const dispatch = useAppDispatch();

  return (
    <ModalComponent title={"Ha ocurrido un error"} onClose={() => dispatch(setError(""))} dismissible={true}  theme="error">
      {pageDataError}
    </ModalComponent>
  );
}

ErrorModal.displayName = "ErrorModal";
export default memo(ErrorModal);
