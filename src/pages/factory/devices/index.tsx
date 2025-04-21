import { useEffect, useState } from "react";
import { GenericRecord } from "@/types";

import BackofficeMainTemplate from "@/templates/BackofficeMainTemplate";
import useSetTable from "@/hooks/useSetTablePage";
import { FaCheckCircle, FaQrcode } from "react-icons/fa";
import { FaTimesCircle } from "react-icons/fa";

// config imports

import filters from "@/config/pages/factory/devices/filters";
import tableConfig from "@/config/pages/factory/devices/table";
import page from "@/config/pages/factory/devices/index";
import PageTableComponent from "@/templates/components/PageTableComponent";
import { useAppDispatch } from "@/redux/hooks";
import { setPage } from "@/slices/pageSlice";
import { useTranslation } from "@/context/contextUtils";
import Link from "next/link";
import { FaTrash } from "react-icons/fa";
import PrintPreview from "@/components/print/PrintPreview";
import ModalComponent from "@/components/modal/ModalComponent";
import { deleteFactoryDevice } from "@/api/factory";
import { setRefresh } from "@/slices/tableSlice";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import { getDevicePrintPdf } from "@/api/print";
import { printPdf } from "@/utils/print";

export const Devices = () => {
  // states
  const [status, setStatus] = useState<string>("pending"); // If there's nothing to load before rendering the page, it should be "prepared"

  const [serialNumber, setSerialNumber] = useState<string>("");
  const [deleteRecord, setDeleteRecord] = useState<GenericRecord | null>(null);
  const [printRecord, setPrintRecord] = useState<GenericRecord | null>(null);

  const t = useTranslation();
  const dispatch = useAppDispatch();

  // Columns additions
  const metaColumns = [
    {
      key: "Id",
      cell: (row: GenericRecord) => (
        <Link
          className="text-dark"
          href={`/factory/devices/device?gid=${row.GroupId}&mid=${row.MachineId}&id=${row.Id}&sn=${serialNumber}`}
        >
          {row.Id}
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
                className={`btn btn-sm btn-danger ms-1`}
                onClick={() => setDeleteRecord({ ended: false, row: row })}
              >
                <FaTrash />
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
    const searchParams = new URLSearchParams(window.location.search);
    const gid = searchParams.get("gid");
    const mid = searchParams.get("mid");
    const sn = searchParams.get("sn");
    setSerialNumber(sn ?? "");
    const p = { ...page };
    const breadcrumb = [...p.breadcrumb];
    breadcrumb[breadcrumb.length - 1] = {
      name: sn ?? "",
      path: `${breadcrumb[breadcrumb.length - 1].path}?gid=${gid}&sn=${sn}`,
    };
    p.breadcrumb = breadcrumb;
    if (mid) {
      dispatch(
        setPage({ ...p, title: mid, infoPath: `${p.infoPath}?gid=${gid}&mid=${mid}&sn=${sn}` }),
      );
    }
    setStatus("prepared");
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
      {status == "ready" && printRecord == null && <PageTableComponent metaColumns={metaColumns} />}
      {printRecord && false &&  (
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
          onActionLabel={!deleteRecord.ended ? "delete" : ""}
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
    </BackofficeMainTemplate>
  );
};

export default Devices;
