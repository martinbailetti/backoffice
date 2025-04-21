import React, { memo } from "react";
import useResponsive from "@/hooks/useResponsive";
import { useAppSelector } from "@/redux/hooks";
import { IoArrowBackSharp } from "react-icons/io5";
import { useTranslation } from "@/context/contextUtils";
import Link from "next/link";
import BackLink from "@/components/navigation/BackLink";

const ContentHeader = ({ status }: { status: string }) => {
  const t = useTranslation();


  const size = useResponsive();
  const pageDataTitle = useAppSelector((state) => state.pageData.title);
  const pageDataTitleStyle = useAppSelector((state) => state.pageData.titleStyle);
  const pageDataSubTitle = useAppSelector((state) => state.pageData.subtitle);
  const pageDataBreadcrumb = useAppSelector((state) => state.pageData.breadcrumb);

  const renderBreadcrumb = React.useCallback(() => {
    const breadcrumb = pageDataBreadcrumb.map((item, index) => {
      return (
        <li className="breadcrumb-item text-nowrap" key={index} >
          <Link href={item.path}>{t(item.name)}</Link>
        </li>
      );
    }, []);

    return (
      <>
        {breadcrumb}
        <li className="breadcrumb-item text-secondary text-nowrap" >{t(pageDataTitle)}</li>
      </>
    );
  }, [pageDataBreadcrumb, pageDataTitle, t]);

  const renderPrevious = React.useCallback(() => {
    let previous = null;
    if (pageDataBreadcrumb.length > 0) {
      previous = pageDataBreadcrumb[pageDataBreadcrumb.length - 1];
    }

    return (
      <BackLink
        className="text-secondary"
         previous={previous?.path || "#"}
      >
        <IoArrowBackSharp />
      </BackLink>
    );
  }, [pageDataBreadcrumb]);

  return (
    <div className="d-flex justify-content-start flex-md-row flex-column justify-content-md-between mx-2 mx-md-3 flex-column-reverse align-items-stretch">
      {status == "ready" && (
        <>
          {size === "medium" && (
            <h1 className="h4 m-0 mt-md-1 text-shadow" style={pageDataTitleStyle?pageDataTitleStyle:{}}>
              {t(pageDataTitle)}{" "}
              {pageDataSubTitle !== "" && (
                <small className="fs-5 text-secondary">{t(pageDataSubTitle ?? "")}</small>
              )}
            </h1>
          )}
          {size === "small" && (
            <div className="d-flex justify-content-between align-items-center">
              <div className="h5 my-1 ">{t(pageDataTitle)}</div>
              <div>{pageDataBreadcrumb.length > 0 && renderPrevious()}</div>
            </div>
          )}

          {size === "medium" && (
            <nav aria-label="breadcrumb">
              <ol className={`breadcrumb mb-0 mt-1 `}>{renderBreadcrumb()}</ol>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default memo(ContentHeader);
