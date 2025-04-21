import React, { memo } from "react";

import useResponsive from "@/hooks/useResponsive";
import { useAppSelector } from "@/redux/hooks";
import { useTranslation } from "@/context/contextUtils";
import BackLink from "../navigation/BackLink";


/**
 * Filters component.
 */

const InfoHeader = ({
  title,
}: {
  title?: string;
}) => {


  const t = useTranslation();

  const size = useResponsive();
  const pageDataBreadcrumb = useAppSelector((state) => state.pageData.breadcrumb);



  const renderPrevious = React.useCallback(() => {
    let previous = null;
    if (pageDataBreadcrumb.length > 0) {
      previous = pageDataBreadcrumb[pageDataBreadcrumb.length - 1];
    }

    return (
      <BackLink
        className="btn btn-outline-secondary ms-2"
        previous={previous?.path || "#"}
      >
        {t("back")}
      </BackLink>
    );
  }, [pageDataBreadcrumb,  t]);
  return (
    <div className="d-none d-md-flex justify-content-between align-items-center flex-wrap p-2 pb-md-2 pt-md-0">
      {title && <div className="fw-semibold">{title}</div>}
      <div className="d-flex justify-content-end align-items-center flex-grow-1">



        {size == "medium" && renderPrevious()}



      </div>
    </div>
  );
};

export default memo(InfoHeader);
