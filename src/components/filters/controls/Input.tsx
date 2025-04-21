import React, { KeyboardEvent, memo, useEffect, useRef } from "react";

import { useTranslation } from "@/context/contextUtils";
import { applyFilter } from "@/slices/tableSlice";
import { useAppDispatch } from "@/redux/hooks";
import useResponsive from "@/hooks/useResponsive";
import { GenericRecord } from "@/types";

/**
 * Input Filter component.
 */

const Input = ({ filter }: GenericRecord) => {
  const t = useTranslation();
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement>(null);

  const size = useResponsive();

  const handleClick = () => {
    if (inputRef.current) {
      if (inputRef.current.value != "") {
        dispatch(applyFilter({ ...filter, value: inputRef.current.value }));
      }
    }
  };

  const handleKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && inputRef.current) {
      if (inputRef.current.value != "") {
        dispatch(applyFilter({ ...filter, value: inputRef.current.value }));
      }
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <>
      <input
        ref={inputRef}
        className={`form-control ${size == "medium" ? "w-auto" : ""}`}
        type={filter.type}
        id={`filter_${filter.id}`}
        onKeyUp={handleKeyUp}
        autoComplete="off"
      />
      <button
        className={`btn btn-primary ms-md-1 mt-1 mt-md-0 ${size == "small" ? "w-100" : ""}`}
        onClick={handleClick}
      >
        {t("apply")}
      </button>
    </>
  );
};
export default memo(Input);
