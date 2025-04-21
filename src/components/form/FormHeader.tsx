import React, { memo } from "react";

import useResponsive from "@/hooks/useResponsive";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/router";
import { useTranslation } from "@/context/contextUtils";
import Link from "next/link";


/**
 * Filters component.
 */

const FormHeader = ({
  title,
  handleReset,
}: {
  title?: string;
  handleReset?: () => void;
}) => {


  const t = useTranslation();

  const size = useResponsive();
  const pageDataBreadcrumb = useAppSelector((state) => state.pageData.breadcrumb);
  const router = useRouter();




  const renderPrevious = React.useCallback(() => {
    let previous = null;
    if (pageDataBreadcrumb.length > 0) {
      previous = pageDataBreadcrumb[pageDataBreadcrumb.length - 1];
    }

    return (
      <Link
        className="btn btn-outline-secondary ms-2"
        href={previous ? previous.path : router.back()}
      >
        {t("back")}
      </Link>
    );
  }, [pageDataBreadcrumb, router, t]);
  return (
    <div className="d-flex justify-content-between align-items-center flex-wrap border-bottom p-2 pb-md-3 pt-md-0">
      {title && <div className="fw-semibold">{title}</div>}
      <div className="d-flex justify-content-end align-items-center flex-grow-1">
        <button
          className={`btn ${size == "small" ? "btn-sm" : ""} btn-outline-success`}
          type="submit"
        >
          {t("save")}
        </button>

        {handleReset && <a
          className={`btn ${size == "small" ? "btn-sm" : ""} btn-outline-dark ms-2`}
          onClick={handleReset}
        >
          {t("reset")}
        </a>}


        {size == "medium" && renderPrevious()}



      </div>
    </div>
  );
};

export default memo(FormHeader);
