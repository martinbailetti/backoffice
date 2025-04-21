import { useEffect, useState } from "react";

import { GenericRecord } from "@/types";

import BackofficeMainTemplate from "@/templates/BackofficeMainTemplate";
import useSetTable from "@/hooks/useSetTablePage";

import { BiSolidFactory } from "react-icons/bi";
import { GrValidate } from "react-icons/gr";
import { FaCheckCircle, FaTimesCircle, FaTrash } from "react-icons/fa";
import { BsBanFill } from "react-icons/bs";

import filters from "@/config/pages/licenses/groups/filters";
import table from "@/config/pages/licenses/groups/table";
import page from "@/config/pages/licenses/groups/index";
import PageTableComponent from "@/templates/components/PageTableComponent";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setPage } from "@/slices/pageSlice";
import Link from "next/link";
import { useTranslation } from "@/context/contextUtils";
import { BsCloudSlashFill } from "react-icons/bs";

import { can } from "@/utils/auth";
import { setRefresh } from "@/slices/tableSlice";
import GroupValidateModal from "@/components/groups/GroupValidateModal";
import GroupInvalidateModal from "@/components/groups/GroupInvalidateModal";
import GroupRequestDeleteModal from "@/components/groups/GroupRequestDeleteModal";
import GroupDeleteModal from "@/components/groups/GroupDeleteModal";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import { LuRefreshCw } from "react-icons/lu";

export const Groups = () => {
  const dispatch = useAppDispatch();
  const t = useTranslation();
  const [validateRecord, setValidateRecord] = useState<GenericRecord | null>(null);
  const [invalidateRecord, setInvalidateRecord] = useState<GenericRecord | null>(null);
  const [requestDeleteRecord, setRequestDeleteRecord] = useState<GenericRecord | null>(null);
  const [deleteRecord, setDeleteRecord] = useState<GenericRecord | null>(null);
  // states
  const [status, setStatus] = useState<string>("prepared"); // If there's nothing to load before rendering the page, it should be "prepared"

  const userData = useAppSelector((state) => state.userData.data);
  // Columns additions
  const metaColumns = [
    {
      key: "actions",
      cell: (row: GenericRecord) => (
        <div className="d-flex flex-column items-center justify-center">
          {userData && can(userData, "validate devices") && row.Total == row.Validated && (
            <div className="mt-1">
              <OverlayTrigger placement="top-start" overlay={<Tooltip>{t("invalidate")}</Tooltip>}>
                <a className="btn btn-sm btn-danger" onClick={() => setInvalidateRecord(row)}>
                  <BsBanFill />
                </a>
              </OverlayTrigger>
            </div>
          )}
          {userData && can(userData, "validate devices") && row.Total !== row.Validated && (
            <div className="mt-1">
              <OverlayTrigger placement="top-start" overlay={<Tooltip>{t("validate")}</Tooltip>}>
                <a className="btn btn-sm btn-success" onClick={() => setValidateRecord(row)}>
                  <GrValidate />
                </a>
              </OverlayTrigger>
            </div>
          )}

          {userData && can(userData, "delete devices") && (
            <div className="mt-1">
              <OverlayTrigger
                placement="top-start"
                overlay={<Tooltip>{t("request_delete")}</Tooltip>}
              >
                <a className="btn btn-sm btn-warning" onClick={() => setRequestDeleteRecord(row)}>
                  <BsCloudSlashFill />
                </a>
              </OverlayTrigger>
            </div>
          )}
          {userData && can(userData, "delete devices") && (
            <div className="my-1">
              <OverlayTrigger placement="top-start" overlay={<Tooltip>{t("delete")}</Tooltip>}>
                <a className="btn btn-sm btn-danger" onClick={() => setDeleteRecord(row)}>
                  <FaTrash />
                </a>
              </OverlayTrigger>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "devices",
      cell: (row: GenericRecord) => (
        <div className="d-flex flex-column  items-center justify-center flex-grow-1">
          <div className="mt-1 d-flex justify-content-between">
            <strong>{t("total")}:</strong>
            <span>{row.Total}</span>
          </div>
          <div className="mt-1 d-flex justify-content-between">
            <strong>{t("active")}:</strong>
            <span>{row.Active}</span>
          </div>
          <div className="mt-1 d-flex justify-content-between">
            <strong>{t("inactive")}:</strong>
            <span>{row.Total - row.Active}</span>
          </div>
          <div className="mt-1 d-flex justify-content-between">
            <strong>{t("reportedactive")}:</strong>
            <span>{row.ReportedActive}</span>
          </div>
          <div className="mt-1 d-flex justify-content-between">
            <strong>{t("validated")}:</strong>
            <span>{row.Validated}</span>
          </div>
          <div className="mt-1 d-flex justify-content-between">
            <strong>{t("validating")}:</strong>
            <span>{row.Validating}</span>
          </div>
          <div className="mt-1 d-flex justify-content-between">
            <strong>{t("expiration")}:</strong>
            <span>{row.Expiration}</span>
          </div>
        </div>
      ),
    },
    {
      key: "GroupId",
      cell: (row: GenericRecord) => (
        <div className="d-flex flex-column w-100">
          <Link className="text-black" href={`/licenses/machines?gid=${row.GroupId}`}>
            {row.GroupId}
          </Link>
          <div className="d-flex items-align-center justify-content-space-between mt-2 flex-grow-1">
            <div className="flex-grow-1">
              {row.Invalidating == row.Total && (
                <span className="me-2 text-danger d-inline-block ">
                  <LuRefreshCw /> {t("invalidating")}
                </span>
              )}
              {row.Validating == row.Total && (
                <span className="me-2 text-success d-inline-block ">
                  <LuRefreshCw /> {t("validating")}
                </span>
              )}
              {row.Deleting == row.Total && (
                <span className="text-danger-emphasis d-inline-block">
                  <LuRefreshCw /> {t("deleting")}
                </span>
              )}
            </div>
            {row.Validated == row.Total ? (
              <div className="text-end pe-2">
                <OverlayTrigger placement="top-start" overlay={<Tooltip>{t("validated")}</Tooltip>}>
                  <span>
                    <FaCheckCircle color="green" />
                  </span>
                </OverlayTrigger>
              </div>
            ) : (
              <div className="text-end pe-2">
                <OverlayTrigger placement="top-start" overlay={<Tooltip>{t("invalid")}</Tooltip>}>
                  <span>
                    <FaTimesCircle color="red" />
                  </span>
                </OverlayTrigger>
              </div>
            )}
          </div>
          <div className="pt-2">
            IP: {row.IP} {row.FactoryIP == 1 ? <BiSolidFactory /> : ""}
          </div>
        </div>
      ),
    },
    {
      key: "IP",
      cell: (row: GenericRecord) => (
        <span>
          {row.IP} {row.FactoryIP == 1 ? <BiSolidFactory /> : ""}
        </span>
      ),
    },
  ];

  useEffect(() => {
    dispatch(
      setPage({
        ...page,
      }),
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // hooks

  useSetTable(status, () => setStatus("ready"), table, filters);

  const endValidation = () => {
    dispatch(setRefresh());
    setValidateRecord(null);
  };
  const endInvalidation = () => {
    dispatch(setRefresh());
    setInvalidateRecord(null);
  };
  const endRequestDelete = () => {
    dispatch(setRefresh());
    setRequestDeleteRecord(null);
  };
  const endDelete = () => {
    dispatch(setRefresh());
    setDeleteRecord(null);
  };

  return (
    <BackofficeMainTemplate status={status}>
      <PageTableComponent metaColumns={metaColumns} />
      {validateRecord && (
        <GroupValidateModal
          record={validateRecord}
          endModal={endValidation}
          setRecord={setValidateRecord}
        />
      )}
      {invalidateRecord && (
        <GroupInvalidateModal
          record={invalidateRecord}
          endModal={endInvalidation}
          setRecord={setInvalidateRecord}
        />
      )}
      {requestDeleteRecord && (
        <GroupRequestDeleteModal
          record={requestDeleteRecord}
          endModal={endRequestDelete}
          setRecord={setRequestDeleteRecord}
        />
      )}
      {deleteRecord && (
        <GroupDeleteModal record={deleteRecord} endModal={endDelete} setRecord={setDeleteRecord} />
      )}
    </BackofficeMainTemplate>
  );
};

export default Groups;
