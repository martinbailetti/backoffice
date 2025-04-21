import { useAppSelector } from "@/redux/hooks";

import { GenericRecord } from "@/types";
import { useTranslation } from "@/context/contextUtils";
import Link from "next/link";
import PrintPreviewViewer from "../print/PrintPreviewViewer";
import { formatMySqlDatetime } from "@/utils";
import { can } from "@/utils/auth";
import { useState } from "react";
import DeviceValidateModal from "./DeviceValidateModal";
import DeviceInvalidateModal from "./DeviceInvalidateModal";
import DeviceDeleteModal from "./DeviceDeleteModal";
import DeviceRequestDeleteModal from "./DeviceRequestDeleteModal";
import DeviceCancelSyncActionRequestModal from "./DeviceCancelSyncActionRequestModal";
import DeviceCancelActionRequestModal from "./DeviceCancelActionRequestModal";
import DeviceSetQuarantineModal from "./DeviceSetQuarantineModal";
import DeviceUnsetQuarantineModal from "./DeviceUnsetQuarantineModal";
import { useRouter } from "next/router";

const DeviceInfoForm = ({
  record,
  currentRecord,
  setCurrentRecord,
  view,
  history,
  activities,
  paths,
  refresh,
}: {
  record: GenericRecord;
  view: string;
  paths: GenericRecord;
  history: GenericRecord[] | null;
  activities: GenericRecord[] | null;
  currentRecord: GenericRecord;
  setCurrentRecord: (currentRecord: GenericRecord) => void;
  refresh?: () => void;
}) => {
  const t = useTranslation();

  const router = useRouter();
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

  const userData = useAppSelector((state) => state.userData.data);

  const endValidation = () => {
    setValidateRecord(null);
    refresh?.();
  };
  const endInvalidation = () => {
    setInvalidateRecord(null);
    refresh?.();
  };
  const endDeletion = () => {

    router.push(`/licenses/devices?gid=${record.GroupId}&mid=${record.MachineId}`);
  };
  const endRequestDeletion = () => {
    setRequestDeleteRecord(null);
    refresh?.();
  };
  const endCancelSyncActionRequest = () => {
    setCancelSyncActionRequestRecord(null);
    refresh?.();
  };
  const endCancelActionRequest = () => {
    setCancelActionRequestRecord(null);
    refresh?.();
  };
  const endSetQuarantine = () => {
    setSetQuarantineDeviceRecord(null);
    refresh?.();
  };
  const endUnsetQuarantine = () => {
    setUnsetQuarantineDeviceRecord(null);
    refresh?.();
  };

  return (
    <>
      {record && (
        <>
          <div className="row m-0">
            <div className="col-12 mb-3"></div>
            <div className="col-md-6 col-12">
              <div className="text-secondary fw-bold">{t("Id")}</div>
              <div className="text-info fw-bold">{record.Id}</div>
            </div>
            <div className="col-md-6 col-12">
              <div className="text-secondary fw-bold">{t("request")}</div>
              <div className="">
                {record.ActionRequest == 0 && record.SyncActionRequest == 0 && <>-</>}
                {record.ActionRequest == 1 && (
                  <>
                    {(view == "show" || !can(userData, "validate devices")) && (
                      <span className={`badge rounded-pill bg-warning text-dark`}>
                        {t("invalidating")}
                      </span>
                    )}
                    {view == "edit" && can(userData, "validate devices") && (
                      <span
                        className={`badge rounded-pill bg-warning text-dark cursor-pointer`}
                        onClick={() => setCancelActionRequestRecord(record)}
                      >
                        {t("invalidating")}
                      </span>
                    )}
                  </>
                )}
                {record.ActionRequest == 2 && (
                  <>
                    {(view == "show" || !can(userData, "validate devices")) && (
                      <span className={`badge rounded-pill bg-warning text-dark`}>
                        {t("validating")}
                      </span>
                    )}
                    {view == "edit" && can(userData, "validate devices") && (
                      <span
                        className={`badge rounded-pill bg-warning text-dark cursor-pointer`}
                        onClick={() => setCancelActionRequestRecord(record)}
                      >
                        {t("validating")}
                      </span>
                    )}
                  </>
                )}
                {record.SyncActionRequest == 1 && (
                  <>
                    {(view == "show" || !can(userData, "request delete devices")) && (
                      <span className={`badge rounded-pill bg-danger text-light`}>
                        {t("deleting")}
                      </span>
                    )}
                    {view == "edit" && can(userData, "request delete devices") && (
                      <span
                        className={`badge rounded-pill bg-danger text-light cursor-pointer`}
                        onClick={() => setCancelSyncActionRequestRecord(record)}
                      >
                        {t("deleting")}
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="col-md-6 col-12 pt-1">
              <div className="text-secondary fw-bold">{t("MachineId")}</div>
              <Link
                className="text-dark"
                href={`${paths.machine}?gid=${record.GroupId}&mid=${record.MachineId}&sn=${record.SerialNumber}`}
              >
                {record.MachineId}
              </Link>
            </div>
            <div className="col-md-6 col-12 pt-1">
              <div className="text-secondary fw-bold">{t("GroupId")}</div>
              <Link
                href={`${paths.group}?gid=${record.GroupId}&sn=${record.SerialNumber}`}
                passHref
                className="text-dark"
              >
                {record.GroupId}
              </Link>
            </div>
            <div className="col-md-6 col-12 pt-1">
              <div className="text-secondary fw-bold">{t("Type")}</div>
              <div className="">{record.Type}</div>
            </div>
            <div className="col-md-6 col-12 pt-1">
              <div className="text-secondary fw-bold">{t("TypeInfo")}</div>
              <div className="">{record.TypeInfo ? record.TypeInfo : "-"}</div>
            </div>
            <div className="col-md-6 col-12 pt-1">
              <div className="text-secondary fw-bold">{t("WhyActive")}</div>
              <div className="">{record.WhyActive}</div>
            </div>
            <div className="col-md-6 col-12 pt-1">
              <div className="text-secondary fw-bold">{t("Active")}</div>
              <div className="">{record.Active ? t("yes") : t("no")}</div>
            </div>
            <div className="col-md-6 col-12 pt-1">
              <div className="text-secondary fw-bold">{t("RPI")}</div>
              {view === "show" && <div className="">{record.RPI ? record.RPI : "-"}</div>}
              {view === "edit" && (
                <input
                  className="form-control"
                  value={currentRecord?.RPI ? currentRecord.RPI : ""}
                  onChange={(e) =>
                    setCurrentRecord({ ...currentRecord, RPI: e.currentTarget.value })
                  }
                />
              )}
            </div>

            <div className="col-md-6 col-12 pt-1">
              <div className="text-secondary fw-bold">{t("ManufacturerSerialNumber")}</div>

              {view === "show" && (
                <div className="">
                  {record.ManufacturerSerialNumber ? record.ManufacturerSerialNumber : "-"}
                </div>
              )}
              {view === "edit" && (
                <input
                  className="form-control"
                  value={
                    currentRecord?.ManufacturerSerialNumber
                      ? currentRecord.ManufacturerSerialNumber
                      : ""
                  }
                  onChange={(e) =>
                    setCurrentRecord({
                      ...currentRecord,
                      ManufacturerSerialNumber: e.currentTarget.value,
                    })
                  }
                />
              )}
            </div>

            <div className="col-12 pt-1">
              <div className="text-secondary fw-bold">{t("Annotation")}</div>

              {view === "show" && (
                <div className="">{record.Annotation ? record.Annotation : "-"}</div>
              )}

              {view === "edit" && (
                <input
                  className="form-control"
                  value={currentRecord?.Annotation ?? ""}
                  onChange={(e) =>
                    setCurrentRecord({
                      ...currentRecord,
                      Annotation: e.currentTarget.value,
                    })
                  }
                />
              )}
            </div>

            <div className="col-md-6 col-12 pt-1">
              <div className="text-secondary fw-bold">{t("MachineSerialNumber")}</div>

              <div className="">
                {record.MachineSerialNumber ? record.MachineSerialNumber : "-"}
              </div>
            </div>
            <div className="col-md-6 col-12 pt-1">
              <div className="text-secondary fw-bold">{t("ClientNumber")}</div>

              <div className="">{record.ClientNumber ? record.ClientNumber : "-"}</div>
            </div>

            <div className="col-md-6 col-12 pt-1">
              <div className="text-secondary fw-bold">{t("ProductDefinition")}</div>

              <div className="">{record.ProductDefinition ? record.ProductDefinition : "-"}</div>
            </div>

            <div className="col-md-6 col-12 pt-1">
              <div className="text-secondary fw-bold">{t("LastActivatedDate")}</div>
              <div className="">{record.LastActivatedDate ? record.LastActivatedDate : "-"}</div>
            </div>

            <div className={`col-12`}></div>

            <div className={`col-12 col-md-6`}></div>

            <div className={`col-12 col-md-6 mb-1 mt-1`}>
              <label className={`text-secondary fw-bold`}>{t("QR")}</label>
              <PrintPreviewViewer devices={[record]} single={true} />
            </div>
          </div>
          {view === "edit" && (
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center border-top border-secondary mt-3 pt-2">
              <div className="d-flex flex-column flex-md-row align-items-center w-md-auto w-100">
                {userData && can(userData, "validate devices") && record.Validated == 1 && (
                  <button
                    type="button"
                    className="btn btn-danger me-md-2 w-md-auto w-100 mb-2 mb-md-0"
                    onClick={() => setInvalidateRecord(record)}
                  >
                    {t("invalidate")}
                  </button>
                )}
                {userData && can(userData, "validate devices") && record.Validated == 0 && (
                  <button
                    type="button"
                    className="btn btn-success me-md-2 w-md-auto w-100 mb-2 mb-md-0"
                    onClick={() => setValidateRecord(record)}
                  >
                    {t("validate")}
                  </button>
                )}

                {can(userData, "request delete devices") && (
                  <button
                    type="button"
                    className={`btn btn-warning me-md-2 w-md-auto w-100 mb-2 mb-md-0 ${record.SyncActionRequest == 1 ? "disabled" : ""}`}
                    onClick={() => setRequestDeleteRecord(record)}
                  >
                    {t("request_delete")}
                  </button>
                )}
                {can(userData, "set quarantine") && record.Quarantine == 0 && (
                  <button
                    type="button"
                    className={`btn btn-dark me-md-2 w-md-auto w-100 mb-2 mb-md-0`}
                    onClick={() => setSetQuarantineDeviceRecord(record)}
                  >
                    {t("set_quarantine")}
                  </button>
                )}
                {can(userData, "set quarantine") && record.Quarantine == 1 && (
                  <button
                    type="button"
                    className={`btn btn-outline-dark me-md-2 w-md-auto w-100 mb-2 mb-md-0`}
                    onClick={() => setUnsetQuarantineDeviceRecord(record)}
                  >
                    {t("unset_quarantine")}
                  </button>
                )}
                {can(userData, "delete devices") && (
                  <button
                    type="button"
                    className="btn btn-danger w-md-auto w-100 mb-2 mb-md-0"
                    onClick={() => setDeleteRecord(record)}
                  >
                    {t("delete")}
                  </button>
                )}
              </div>
              <div className="d-flex flex-column flex-md-row align-items-center w-md-auto w-100">
                <button
                  type="submit"
                  className="btn btn-primary me-md-2 w-md-auto w-100 mb-2 mb-md-0"
                >
                  {t("save")}
                </button>
                <a
                  className="btn btn-secondary w-md-auto w-100"
                  onClick={() => setCurrentRecord(record)}
                >
                  {t("cancel")}
                </a>
              </div>
            </div>
          )}
          {view === "show" && (
            <div className="row m-0">
              <h5 className="text-info fw-bold ps-2 mt-3 border-top pt-3 border-secondary text-uppercase">
                {t("history")}
              </h5>
              {history && history.length > 0 && (
                <div className="col-12 overflow-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="px-1 text-secondary">{t("GroupId")}</th>
                        <th className="px-1 text-secondary">{t("MachineId")}</th>
                        <th className="px-1 text-end text-secondary">{t("Action")}</th>
                        <th className="px-1 text-secondary">{t("ActionExtraInfo")}</th>
                        <th className="px-1 text-secondary">{t("Description")}</th>
                        <th className="px-1 text-secondary">{t("InsertionTimestamp")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((element: GenericRecord, index: number) => (
                        <tr key={index}>
                          <td className="px-1 text-nowrap">{element.GroupId}</td>
                          <td className="px-1 text-nowrap">{element.MachineId}</td>
                          <td className="px-1 text-end text-nowrap">{element.Action}</td>
                          <td className="px-1 text-nowrap">{element.ActionExtraInfo}</td>
                          <td className="px-1 text-nowrap" style={{ minWidth: "250px" }}>
                            {element.Description}
                          </td>
                          <td className="px-1 text-nowrap">{element.InsertionTimestamp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {history && history.length == 0 && (
                <div className="col-12 overflow-auto">{t("no_records_found")}</div>
              )}
            </div>
          )}
          {view === "show" && (
            <div className="row m-0">
              <h5 className="text-info fw-bold ps-2 mt-3 border-top pt-3 border-secondary text-uppercase">
                {t("activity_history")}
              </h5>
              {activities && activities.length > 0 && (
                <div className="col-12 overflow-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="px-1 text-secondary">{t("date")}</th>
                        <th className="px-1 text-secondary">{t("action")}</th>
                        <th className="px-1  text-secondary">{t("username")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activities.map((element: GenericRecord, index: number) => (
                        <tr key={index}>
                          <td className="px-1 text-nowrap">
                            {formatMySqlDatetime(element.created_at)}
                          </td>
                          <td className="px-1 text-nowrap">{t(element.action)}</td>
                          <td className="px-1 text-nowrap">{element.name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {activities && activities.length == 0 && (
                <div className="col-12 overflow-auto">{t("no_records_found")}</div>
              )}
            </div>
          )}
        </>
      )}

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
    </>
  );
};
export default DeviceInfoForm;
