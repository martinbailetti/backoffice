import { useEffect, useState } from "react";
import { GenericRecord } from "@/types";

import BackofficeMainTemplate from "@/templates/BackofficeMainTemplate";
import useSetTable from "@/hooks/useSetTablePage";

// config imports

import tableConfig from "@/config/pages/licenses/machines/table";
import page from "@/config/pages/licenses/machines/index";
import PageTableComponent from "@/templates/components/PageTableComponent";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setPage } from "@/slices/pageSlice";
import Link from "next/link";
import { BsBanFill, BsCloudSlashFill } from "react-icons/bs";
import { GrValidate } from "react-icons/gr";
import { FaCheckCircle, FaTimesCircle, FaTrash } from "react-icons/fa";
import { useTranslation } from "@/context/contextUtils";
import { can } from "@/utils/auth";
import MachineInvalidateModal from "@/components/machines/MachineInvalidateModal";
import MachineValidateModal from "@/components/machines/MachineValidateModal";
import { setRefresh } from "@/slices/tableSlice";
import { getMachinePosition } from "@/utils";
import MachineRequestDeleteModal from "@/components/machines/MachineRequestDeleteModal";
import MachineDeleteModal from "@/components/machines/MachineDeleteModal";
import { FaDoorClosed, FaDoorOpen } from "react-icons/fa6";
import { LuRefreshCw } from "react-icons/lu";
import MachineQuarantineModal from "@/components/machines/MachineQuarantineModal";
import MachineUnquarantineModal from "@/components/machines/MachineUnquarantineModal";
import { Tooltip, OverlayTrigger } from "react-bootstrap";

export const Machines = () => {
  // states
  const [status, setStatus] = useState<string>("pending"); // If there's nothing to load before rendering the page, it should be "prepared"
  const [validateRecord, setValidateRecord] = useState<GenericRecord | null>(null);
  const [invalidateRecord, setInvalidateRecord] = useState<GenericRecord | null>(null);
  const [requestDeleteRecord, setRequestDeleteRecord] = useState<GenericRecord | null>(null);
  const [deleteRecord, setDeleteRecord] = useState<GenericRecord | null>(null);
  const [quarantineRecord, setQuarantineRecord] = useState<GenericRecord | null>(null);
  const [unquarantineRecord, setUnquarantineRecord] = useState<GenericRecord | null>(null);

  const userData = useAppSelector((state) => state.userData.data);
  const dispatch = useAppDispatch();

  const t = useTranslation();
  // Columns additions
  const metaColumns = [
    {
      key: "actions",
      cell: (row: GenericRecord) => (
        <div className="d-flex flex-column items-center justify-center my-1">
          {userData && can(userData, "validate devices") && row.Total === row.Validated && (
            <OverlayTrigger placement="top-start" overlay={<Tooltip>{t("invalidate")}</Tooltip>}>
              <a className="btn btn-sm btn-danger" onClick={() => setInvalidateRecord(row)}>
                <BsBanFill />
              </a>
            </OverlayTrigger>
          )}
          {userData && can(userData, "validate devices") && row.Total !== row.Validated && (
            <OverlayTrigger placement="top-start" overlay={<Tooltip>{t("validate")}</Tooltip>}>
              <a className="btn btn-sm btn-success" onClick={() => setValidateRecord(row)}>
                <GrValidate />
              </a>
            </OverlayTrigger>
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
          {userData && can(userData, "set quarantine") && row.Quarantined == 0 && (
            <div className="mt-1">
              <OverlayTrigger
                placement="top-start"
                overlay={<Tooltip>{t("set_quarantine")}</Tooltip>}
              >
                <a className="btn btn-sm btn-dark" onClick={() => setQuarantineRecord(row)}>
                  <FaDoorClosed />
                </a>
              </OverlayTrigger>
            </div>
          )}
          {userData && can(userData, "set quarantine") && row.Quarantined > 0 && (
            <div className="mt-1">
              <OverlayTrigger
                placement="top-start"
                overlay={<Tooltip>{t("unset_quarantine")}</Tooltip>}
              >
                <a
                  className="btn btn-sm btn-outline-dark"
                  onClick={() => setUnquarantineRecord(row)}
                >
                  <FaDoorOpen />
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
      key: "MachineId",
      cell: (row: GenericRecord) => (
        <div className="d-flex flex-column items-align-center justify-content-center my-2 flex-grow-1">
          <Link
            className="text-dark"
            href={`/licenses/devices?gid=${row.GroupId}&mid=${row.MachineId}`}
          >
            {row.MachineId}
          </Link>
          <div className="d-flex items-align-center justify-content-space-between mt-2 flex-grow-1">
            <div className="flex-grow-1">
              {row.Invalidating == row.Total && (
                <a className="me-2 text-danger d-inline-block ">
                  <LuRefreshCw /> {t("invalidating")}
                </a>
              )}
              {row.Validating == row.Total && (
                <a className="me-2 text-success d-inline-block ">
                  <LuRefreshCw /> {t("validating")}
                </a>
              )}
              {row.Deleting == row.Total && (
                <a className="text-danger-emphasis d-inline-block">
                  <LuRefreshCw /> {t("deleting")}
                </a>
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

            {row.Quarantined > 0 && (
              <div className="text-end ">
                <OverlayTrigger
                  placement="top-start"
                  overlay={<Tooltip>{t("in_quarantine")}</Tooltip>}
                >
                  <span>
                    <FaDoorClosed color="black" />
                  </span>
                </OverlayTrigger>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "Position",
      cell: (row: GenericRecord) => <>{getMachinePosition(row.Position)}</>,
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
  ];

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const gid = searchParams.get("gid");
    dispatch(setPage({ ...page, title: gid, infoPath: `${page.infoPath}?gid=${gid}` }));
    setStatus("prepared");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // hooks

  useSetTable(status, () => setStatus("ready"), tableConfig);

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
  const endQuarantine = () => {
    dispatch(setRefresh());
    setQuarantineRecord(null);
  };
  const endUnquarantine = () => {
    dispatch(setRefresh());
    setUnquarantineRecord(null);
  };
  return (
    <BackofficeMainTemplate status={status}>
      <PageTableComponent metaColumns={metaColumns} />
      {validateRecord && (
        <MachineValidateModal
          record={validateRecord}
          endModal={endValidation}
          setRecord={setValidateRecord}
        />
      )}
      {invalidateRecord && (
        <MachineInvalidateModal
          record={invalidateRecord}
          endModal={endInvalidation}
          setRecord={setInvalidateRecord}
        />
      )}
      {requestDeleteRecord && (
        <MachineRequestDeleteModal
          record={requestDeleteRecord}
          endModal={endRequestDelete}
          setRecord={setRequestDeleteRecord}
        />
      )}
      {deleteRecord && (
        <MachineDeleteModal
          record={deleteRecord}
          endModal={endDelete}
          setRecord={setDeleteRecord}
        />
      )}
      {quarantineRecord && (
        <MachineQuarantineModal
          record={quarantineRecord}
          endModal={endQuarantine}
          setRecord={setQuarantineRecord}
        />
      )}
      {unquarantineRecord && (
        <MachineUnquarantineModal
          record={unquarantineRecord}
          endModal={endUnquarantine}
          setRecord={setUnquarantineRecord}
        />
      )}
    </BackofficeMainTemplate>
  );
};

export default Machines;
