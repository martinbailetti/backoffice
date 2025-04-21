import { useEffect, useState } from "react";
import { GenericRecord } from "@/types";

import BackofficeMainTemplate from "@/templates/BackofficeMainTemplate";
import useSetTable from "@/hooks/useSetTablePage";

// config imports

import filters from "@/config/pages/search/filters";
import tableConfig from "@/config/pages/search/table";
import page from "@/config/pages/search/index";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setRefresh } from "@/slices/tableSlice";
import { MdOutlineWifi, MdOutlineWifiOff } from "react-icons/md";
import { setPage } from "@/slices/pageSlice";
import PageTableComponent from "@/templates/components/PageTableComponent";
import { FaCheckCircle, FaLock, FaTimesCircle, FaTrash, FaUnlock } from "react-icons/fa";
import { settings } from "@/config";
import { useTranslation } from "@/context/contextUtils";
import DeviceValidateModal from "@/components/devices/DeviceValidateModal";
import DeviceInvalidateModal from "@/components/devices/DeviceInvalidateModal";
import { LuRefreshCw } from "react-icons/lu";
import Link from "next/link";
import { can } from "@/utils/auth";
import { BsBanFill, BsCloudSlashFill } from "react-icons/bs";
import { GrValidate } from "react-icons/gr";
import { BiSolidFactory } from "react-icons/bi";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import DeviceUnsetQuarantineModal from "@/components/devices/DeviceUnsetQuarantineModal";
import DeviceSetQuarantineModal from "@/components/devices/DeviceSetQuarantineModal";
import DeviceCancelActionRequestModal from "@/components/devices/DeviceCancelActionRequestModal";
import DeviceCancelSyncActionRequestModal from "@/components/devices/DeviceCancelSyncActionRequestModal";
import DeviceRequestDeleteModal from "@/components/devices/DeviceRequestDeleteModal";
import DeviceDeleteModal from "@/components/devices/DeviceDeleteModal";

export const Search = () => {

  
  // states
  const [status, setStatus] = useState<string>("prepared"); // If there's nothing to load before rendering the page, it should be "prepared"
  const [validateRecord, setValidateRecord] = useState<GenericRecord | null>(null);
  const [invalidateRecord, setInvalidateRecord] = useState<GenericRecord | null>(null);
  const [deleteRecord, setDeleteRecord] = useState<GenericRecord | null>(null);
  const [requestDeleteRecord, setRequestDeleteRecord] = useState<GenericRecord | null>(null);

  const [cancelSyncActionRequestRecord, setCancelSyncActionRequestRecord] =
    useState<GenericRecord | null>(null);
  const [cancelActionRequestRecord, setCancelActionRequestRecord] = useState<GenericRecord | null>(
    null,
  );

  const [setQuarantineDeviceRecord, setSetQuarantineDeviceRecord] = useState<GenericRecord | null>(
    null,
  );
  const [unsetQuarantineDeviceRecord, setUnsetQuarantineDeviceRecord] =
    useState<GenericRecord | null>(null);
  const dispatch = useAppDispatch();

  const t = useTranslation();

  const userData = useAppSelector((state) => state.userData.data);
  // Columns additions

  // Columns additions
  const metaColumns = [
    {
      key: "actions",
      cell: (row: GenericRecord) => (
        <div className="d-flex flex-column items-center justify-center my-1">
          {userData && can(userData, "validate devices") && row.Validated == 1 && (
            <OverlayTrigger placement="top-start" overlay={<Tooltip>{t("invalidate")}</Tooltip>}>
              <a
                className={`btn btn-sm btn-danger ${row.ActionRequest == 1 ? "disabled" : ""}`}
                onClick={() => setInvalidateRecord(row)}
              >
                <BsBanFill />
              </a>
            </OverlayTrigger>
          )}
          {userData && can(userData, "validate devices") && row.Validated == 0 && (
            <OverlayTrigger placement="top-start" overlay={<Tooltip>{t("validate")}</Tooltip>}>
              <a
                className={`btn btn-sm btn-success ${row.ActionRequest == 2 ? "disabled" : ""}`}
                onClick={() => setValidateRecord(row)}
              >
                <GrValidate />
              </a>
            </OverlayTrigger>
          )}

          {userData && can(userData, "request delete devices") && (
            <div className="mt-1">
              <OverlayTrigger
                placement="top-start"
                overlay={<Tooltip>{t("request_delete")}</Tooltip>}
              >
                <a
                  className={`btn btn-sm btn-warning ${row.SyncActionRequest == 1 ? "disabled" : ""}`}
                  onClick={() => setRequestDeleteRecord(row)}
                >
                  <BsCloudSlashFill />
                </a>
              </OverlayTrigger>
            </div>
          )}
          {userData && can(userData, "set quarantine") && row.Quarantine == 0 && (
            <div className="mt-1">
              <OverlayTrigger
                placement="top-start"
                overlay={<Tooltip>{t("set_quarantine")}</Tooltip>}
              >
                <a
                  className={`btn btn-sm btn-dark`}
                  onClick={() => setSetQuarantineDeviceRecord(row)}
                >
                  <FaLock />
                </a>
              </OverlayTrigger>
            </div>
          )}
          {userData && can(userData, "set quarantine") && row.Quarantine == 1 && (
            <div className="mt-1">
              <OverlayTrigger
                placement="top-start"
                overlay={<Tooltip>{t("unset_quarantine")}</Tooltip>}
              >
                <a
                  className={`btn btn-sm btn-outline-dark`}
                  onClick={() => setUnsetQuarantineDeviceRecord(row)}
                >
                  <FaUnlock />
                </a>
              </OverlayTrigger>
            </div>
          )}
          {userData && can(userData, "delete devices") && (
            <div className="mt-1">
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
      key: "Id",
      cell: (row: GenericRecord) => (
        <div className="d-flex flex-column items-align-center justify-content-center my-2 flex-grow-1">
          <Link
            className="text-dark"
            href={`/search/device?gid=${row.GroupId}&mid=${row.MachineId}&id=${row.Id}`}
          >
            {row.Id}
          </Link>

          <div className="d-flex items-align-center justify-content-space-between mt-2 flex-grow-1">
            <div className="flex-grow-1">
              {row.FactoryIP == 1 && <BiSolidFactory />}

              {row.ActionRequest == 1 && (
                <a
                  className="me-2 text-danger d-inline-block "
                  onClick={() => setCancelActionRequestRecord(row)}
                >
                  <LuRefreshCw /> {t("invalidating")}
                </a>
              )}
              {row.ActionRequest == 2 && (
                <a
                  className="me-2 text-success d-inline-block "
                  onClick={() => setCancelActionRequestRecord(row)}
                >
                  <LuRefreshCw /> {t("validating")}
                </a>
              )}
              {row.SyncActionRequest == 1 && (
                <a
                  className="text-danger-emphasis d-inline-block"
                  onClick={() => setCancelSyncActionRequestRecord(row)}
                >
                  <LuRefreshCw /> {t("deleting")}
                </a>
              )}
            </div>
            {row.Validated == 1 ? (
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
            {row.Connected == 1 ? (
              <div className="text-end pe-2">
                <OverlayTrigger placement="top-start" overlay={<Tooltip>{t("connected")}</Tooltip>}>
                  <span>
                    <MdOutlineWifi color="green" />
                  </span>
                </OverlayTrigger>
              </div>
            ) : (
              <div className="text-end pe-2">
                <OverlayTrigger
                  placement="top-start"
                  overlay={<Tooltip>{t("disconnected")}</Tooltip>}
                >
                  <span>
                    <MdOutlineWifiOff color="red" />
                  </span>
                </OverlayTrigger>
              </div>
            )}
            {row.Quarantine == 1 && (
              <div className="text-end">
                <OverlayTrigger
                  placement="top-start"
                  overlay={<Tooltip>{t("in_quarantine")}</Tooltip>}
                >
                  <span>
                    <FaLock color="black" />
                  </span>
                </OverlayTrigger>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "Active",
      cell: (row: GenericRecord) => (
        <>
          {row.Active ? (
            <div className="d-flex flex-column items-align-center justify-content-center flex-grow-1 text-success overflow-hidden">
              <small className="text-center">{row.WhyActive}</small>
              <div className="text-center py-1">
                <FaCheckCircle />
              </div>
              <small className="text-center text-nowrap">{row.WhyActiveString}</small>
            </div>
          ) : (
            <div className="d-flex flex-column items-align-center justify-content-center flex-grow-1 text-danger overflow-hidden">
              <small className="text-center">{row.WhyActive}</small>
              <div className="text-center py-1">
                <FaTimesCircle />
              </div>
              <small className="text-center text-nowrap">{row.WhyActiveString}</small>
            </div>
          )}
        </>
      ),
    },
    {
      key: "WhyActive",
      cell: (row: GenericRecord) => (
        <>
          {settings.not_validated_whyactive.some((value) => value == row.WhyActive) ? (
            <span className="text-danger">{row.WhyActive}</span>
          ) : (
            <span>{row.WhyActive}</span>
          )}
        </>
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
  useSetTable(status, () => setStatus("ready"), tableConfig, filters);

  const endValidation = () => {
    dispatch(setRefresh());
    setValidateRecord(null);
  };
  const endInvalidation = () => {
    dispatch(setRefresh());
    setInvalidateRecord(null);
  };
  const endDeletion = () => {
    dispatch(setRefresh());
    setDeleteRecord(null);
  };
  const endRequestDeletion = () => {
    dispatch(setRefresh());
    setRequestDeleteRecord(null);
  };
  const endCancelSyncActionRequest = () => {
    dispatch(setRefresh());
    setCancelSyncActionRequestRecord(null);
  };
  const endCancelActionRequest = () => {
    dispatch(setRefresh());
    setCancelActionRequestRecord(null);
  };
  const endSetQuarantine = () => {
    dispatch(setRefresh());
    setSetQuarantineDeviceRecord(null);
  };
  const endUnsetQuarantine = () => {
    dispatch(setRefresh());
    setUnsetQuarantineDeviceRecord(null);
  };
  return (
    <BackofficeMainTemplate status={status}>
      {status == "ready" && <PageTableComponent metaColumns={metaColumns} />}

      {validateRecord && (
        <DeviceValidateModal
          record={validateRecord}
          endModal={endValidation}
          setRecord={setValidateRecord}
        />
      )}
      {invalidateRecord && (
        <DeviceInvalidateModal
          record={invalidateRecord}
          endModal={endInvalidation}
          setRecord={setInvalidateRecord}
        />
      )}
      {deleteRecord && (
        <DeviceDeleteModal
          record={deleteRecord}
          endModal={endDeletion}
          setRecord={setDeleteRecord}
        />
      )}
      {requestDeleteRecord && (
        <DeviceRequestDeleteModal
          record={requestDeleteRecord}
          endModal={endRequestDeletion}
          setRecord={setRequestDeleteRecord}
        />
      )}
      {cancelSyncActionRequestRecord && (
        <DeviceCancelSyncActionRequestModal
          record={cancelSyncActionRequestRecord}
          endModal={endCancelSyncActionRequest}
          setRecord={setCancelSyncActionRequestRecord}
        />
      )}
      {cancelActionRequestRecord && (
        <DeviceCancelActionRequestModal
          record={cancelActionRequestRecord}
          endModal={endCancelActionRequest}
          setRecord={setCancelActionRequestRecord}
        />
      )}
      {setQuarantineDeviceRecord && (
        <DeviceSetQuarantineModal
          record={setQuarantineDeviceRecord}
          endModal={endSetQuarantine}
          setRecord={setSetQuarantineDeviceRecord}
        />
      )}
      {unsetQuarantineDeviceRecord && (
        <DeviceUnsetQuarantineModal
          record={unsetQuarantineDeviceRecord}
          endModal={endUnsetQuarantine}
          setRecord={setUnsetQuarantineDeviceRecord}
        />
      )}
    </BackofficeMainTemplate>
  );
};

export default Search;
