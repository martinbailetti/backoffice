import React, { memo, useRef } from "react";

import { useTranslation } from "@/context/contextUtils";
import { applyFilter } from "@/slices/tableSlice";
import { useAppDispatch } from "@/redux/hooks";
import useResponsive from "@/hooks/useResponsive";
import { GenericRecord } from "@/types";

/**
 * Input Filter component.
 */

const DateRange = ({ filter }: GenericRecord) => {
  const t = useTranslation();
  const dispatch = useAppDispatch();
  const fromRef = useRef<HTMLInputElement>(null);
  const toRef = useRef<HTMLInputElement>(null);

  const size = useResponsive();

  const handleClick = () => {
    const data = { from: "", to: "" };
    if (fromRef.current) {
      if (fromRef.current.value != "") {
        data.from = fromRef.current.value;
      }
    }
    if (toRef.current) {
      if (toRef.current.value != "") {
        data.to = toRef.current.value;
      }
    }
    if (data.from == "" && data.to == "") {
      return;
    }

    dispatch(applyFilter({ ...filter, value: data }));
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const data = { from: "", to: "" };
      if (fromRef.current) {
        if (fromRef.current.value != "") {
          data.from = fromRef.current.value;
        }
      }
      if (toRef.current) {
        if (toRef.current.value != "") {
          data.to = toRef.current.value;
        }
      }
      if (data.from == "" && data.to == "") {
        return;
      }
      dispatch(applyFilter({ ...filter, value: data }));
    }
  };
  return (
    <>
      <label htmlFor={`filter_${filter.id}_from`}>From </label>
      <input
        ref={fromRef}
        className={`form-control ${size == "medium" ? "w-auto" : ""}`}
        type="date"
        id={`filter_${filter.id}_from`}
        onKeyUp={handleKeyUp}
      />
      <label htmlFor={`filter_${filter.id}_to`}>To </label>
      <input
        ref={toRef}
        className={`form-control ${size == "medium" ? "w-auto" : ""}`}
        type="date"
        id={`filter_${filter.id}_to`}
        onKeyUp={handleKeyUp}
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
export default memo(DateRange);
