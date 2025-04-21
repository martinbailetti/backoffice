import { useEffect, useState } from "react";
import { GenericRecord } from "@/types";

import BackofficeMainTemplate from "@/templates/BackofficeMainTemplate";
import useSetTable from "@/hooks/useSetTablePage";
// config imports

import filters from "@/config/pages/factory/search/filters";
import tableConfig from "@/config/pages/factory/search/table";
import page from "@/config/pages/factory/search/index";
import { useAppDispatch } from "@/redux/hooks";
import { setRefresh } from "@/slices/tableSlice";
import { setPage } from "@/slices/pageSlice";
import PageTableComponent from "@/templates/components/PageTableComponent";
import { FaCheckCircle, FaQrcode, FaTimesCircle, FaTrash, FaTruck } from "react-icons/fa";
import { useTranslation } from "@/context/contextUtils";
import Link from "next/link";
import ModalComponent from "@/components/modal/ModalComponent";
import PrintPreview from "@/components/print/PrintPreview";
import { deleteFactoryDevice } from "@/api/factory";
import { BiSolidFactory } from "react-icons/bi";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import { getDevicePrintPdf } from "@/api/print";
import FactoryDispatchDevicesModal from "@/components/factory/devices/FactoryDispatchDevicesModal";
import FactoryReenterDevicesModal from "@/components/factory/devices/FactoryReenterDevicesModal";
import FactoryDispatchDeviceModal from "@/components/factory/devices/FactoryDispatchDeviceModal";
import FactoryReenterDeviceModal from "@/components/factory/devices/FactoryReenterDeviceModal";
import { printPdf } from "@/utils/print";
export const Search = () => {
  // states
  const [status, setStatus] = useState<string>("prepared"); // If there's nothing to load before rendering the page, it should be "prepared"

  const [deleteRecord, setDeleteRecord] = useState<GenericRecord | null>(null);
  const [printRecord, setPrintRecord] = useState<GenericRecord | null>(null);
  const [dispatchDevices, setDispatchDevices] = useState<boolean>(false);
  const [undispatchDevices, setUndispatchDevices] = useState<boolean>(false);
  const [dispatchDevice, setDispatchDevice] = useState<GenericRecord | null>(null);
  const [undispatchDevice, setUndispatchDevice] = useState<GenericRecord | null>(null);
  const dispatch = useAppDispatch();

  const t = useTranslation();

  // Columns additions
  const metaColumns = [
    {
      key: "Id",
      cell: (row: GenericRecord) => (
        <Link
          className="cursor-pointer text-black"
          href={`/factory/search/device?gid=${row.GroupId}&mid=${row.MachineId}&id=${row.Id}`}
        >
          {row.Id} {row.FactoryIP == 1 ? <BiSolidFactory /> : ""}
        </Link>
      ),
    },
    {
      key: "actions",
      cell: (row: GenericRecord) => (
        <div className="d-flex justify-content-center align-items-center">
          <div>
            <OverlayTrigger placement="top-start" overlay={<Tooltip>{t("print")}</Tooltip>}>
              <a
                className={`btn btn-sm ${row.QRCode == 1 ? "btn-success" : "btn-primary"}`}
                onClick={() => setPrintRecord({ ended: false, row: row })}
              >
                <FaQrcode />
              </a>
            </OverlayTrigger>
          </div>
          <div className={`ms-1`}>
            <OverlayTrigger placement="top-start" overlay={<Tooltip>{t("delete")}</Tooltip>}>
              <a
                className={`btn btn-sm btn-danger`}
                onClick={() => setDeleteRecord({ ended: false, row: row })}
              >
                <FaTrash />
              </a>
            </OverlayTrigger>
          </div>
          <div className={`ms-1`}>
            <OverlayTrigger
              placement="top-start"
              overlay={
                <Tooltip>{row.FactoryDispatched == 1 ? t("reenter") : t("dispatch")}</Tooltip>
              }
            >
              <a
                className={`btn btn-sm ${row.FactoryDispatched == 1 ? "btn-warning" : "btn-dark"}`}
                onClick={
                  row.FactoryDispatched == 1
                    ? () => setUndispatchDevice(row)
                    : () => setDispatchDevice(row)
                }
              >
                <FaTruck className={`${row.FactoryDispatched == 1 ? "icon-flipped" : ""}`} />
              </a>
            </OverlayTrigger>
          </div>
        </div>
      ),
    },
    {
      key: "validated",
      cell: (row: GenericRecord) => (
        <>
          {row.validated == 1 ? (
            <>
              <FaCheckCircle color="green" />{" "}
            </>
          ) : (
            <>
              <FaTimesCircle color="red" />{" "}
            </>
          )}
        </>
      ),
    },
    {
      key: "ActionRequest",
      cell: (row: GenericRecord) => (
        <>
          {row.SyncActionRequest == 1 && (
            <span className="ms-2 badge rounded-pill bg-warning text-dark d-inline-block w-70px">
              {t("deleting")}
            </span>
          )}
          {row.SyncActionRequest == 0}
        </>
      ),
    },
    {
      key: "Active",
      cell: (row: GenericRecord) => (
        <>
          {row.Active ? (
            <>
              <FaCheckCircle color="green" />
            </>
          ) : (
            <>
              <FaTimesCircle color="red" />
            </>
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

  const deleteDevice = async () => {
    console.log("delete", deleteRecord);
    if (!deleteRecord) return;
    try {
      const result = await deleteFactoryDevice(deleteRecord.row);
      if (result.data.success) {
        setDeleteRecord({ ...deleteRecord, ended: true });
        dispatch(setRefresh());
      }
    } catch (e) {
      console.log(e);
    }
  };


  const printDevice = async () => {
    console.log("print", printRecord);
    if (!printRecord) return;
    try {
      const result = await getDevicePrintPdf(
        printRecord.row.GroupId,
        printRecord.row.MachineId,
        printRecord.row.Id,
      );
      if (result.data.success) {
        setPrintRecord({ ...printRecord, ended: true });
        printPdf(result.data.file);
        dispatch(setRefresh());
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <BackofficeMainTemplate status={status}>
      {status == "ready" && (
        <PageTableComponent
          metaColumns={metaColumns}
          customMultiActions={[
            { label: "dispatch", action: () => setDispatchDevices(true) },
            { label: "reenter", action: () => setUndispatchDevices(true) },
          ]}
        />
      )}
      {printRecord && false && (
        <PrintPreview
          devices={[printRecord as GenericRecord]}
          close={() => {
            setPrintRecord(null);
          }}
        />
      )}
      {printRecord && (
        <ModalComponent
          title={t("print")}
          onAction={printDevice}
          onActionLabel={!printRecord.ended ? "print" : ""}
          onClose={() => {
            setPrintRecord(null);
          }}
          closeButton={true}
        >
          {!printRecord.ended && (
            <>
              <div>{t("confirm_device_print")}</div>
              <div>{printRecord.row.Id}</div>
            </>
          )}
          {printRecord.ended && (
            <>
              <div>{t("print_executed_successfully")}</div>
              <div>{printRecord.row.Id}</div>
            </>
          )}
        </ModalComponent>
      )}
      {deleteRecord && (
        <ModalComponent
          title={t("delete")}
          onAction={deleteDevice}
          onActionLabel={deleteRecord.ended ? "" : "delete"}
          onClose={() => {
            setDeleteRecord(null);
          }}
          closeButton={true}
        >
          {!deleteRecord.ended && (
            <>
              <div>{t("confirm_device_delete")}</div>
              <div>{deleteRecord.row.Id}</div>
            </>
          )}
          {deleteRecord.ended && (
            <>
              <div>{t("delete_executed_successfully")}</div>
              <div>{deleteRecord.row.Id}</div>
            </>
          )}
        </ModalComponent>
      )}
      {dispatchDevice && (
        <FactoryDispatchDeviceModal
          endDispatchDevice={() => {
            dispatch(setRefresh());
            setDispatchDevice(null);
          }}
          dispatchDevice={dispatchDevice}
        />
      )}
      {undispatchDevice && (
        <FactoryReenterDeviceModal
          endUndispatchDevice={() => {
            dispatch(setRefresh());
            setUndispatchDevice(null);
          }}
          undispatchDevice={undispatchDevice}
        />
      )}
      {undispatchDevices && (
        <FactoryReenterDevicesModal
          endUndispatchDevices={() => {
            dispatch(setRefresh());
            setUndispatchDevices(false);
          }}
        />
      )}
      {dispatchDevices && (
        <FactoryDispatchDevicesModal
          endDispatchDevices={() => {
            dispatch(setRefresh());
            setDispatchDevices(false);
          }}
        />
      )}
    </BackofficeMainTemplate>
  );
};

export default Search;
