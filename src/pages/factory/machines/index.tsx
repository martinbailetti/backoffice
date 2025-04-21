import { useEffect, useState } from "react";
import { GenericRecord } from "@/types";

import BackofficeMainTemplate from "@/templates/BackofficeMainTemplate";
import useSetTable from "@/hooks/useSetTablePage";

import { FaTrash } from "react-icons/fa";
import { FaListCheck } from "react-icons/fa6";
import { FaQrcode } from "react-icons/fa";
// config imports

import tableConfig from "@/config/pages/factory/machines/table";
import page from "@/config/pages/factory/machines/index";
import PageTableComponent from "@/templates/components/PageTableComponent";
import { useAppDispatch } from "@/redux/hooks";
import { setPage } from "@/slices/pageSlice";
import { useTranslation } from "@/context/contextUtils";
import { setRefresh } from "@/slices/tableSlice";
import Link from "next/link";
import { deleteFactoryMachine } from "@/api/factory";
import ModalComponent from "@/components/modal/ModalComponent";
import PrintPreview from "@/components/print/PrintPreview";
import { getMachinePosition } from "@/utils";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import { getMachinePrintPdf } from "@/api/print";
import { printPdf } from "@/utils/print";

export const Machines = () => {
  // states
  const [status, setStatus] = useState<string>("pending"); // If there's nothing to load before rendering the page, it should be "prepared"

  const [serialNumber, setSerialNumber] = useState<string>("");
  const [deleteRecord, setDeleteRecord] = useState<GenericRecord | null>(null);
  const [devices, setDevices] = useState<GenericRecord[]>([]);
  const [printRecord, setPrintRecord] = useState<GenericRecord | null>(null);

  const t = useTranslation();
  const dispatch = useAppDispatch();

  const getPrintQRClass = (row: GenericRecord) => {
    if (row.PrintedQR == 0) {
      return "btn-primary";
    } else if (row.PrintedQR != row.Total) {
      return "btn-danger";
    } else {
      return "btn-success";
    }
  };
  const getCheckedClass = (row: GenericRecord) => {
    if (row.checked == 1) {
      return "btn-success";
    } else if (row.checked == 0) {
      return "btn-danger";
    } else {
      return "btn-secondary disabled";
    }
  };
  // Columns additions
  const metaColumns = [
    {
      key: "actions",
      cell: (row: GenericRecord) => (
        <div className="d-flex justify-content-center align-items-center">
          <div>
            <OverlayTrigger placement="top-start" overlay={<Tooltip>{t("view_model")}</Tooltip>}>
              <Link
                href={`/factory/machine_model?gid=${row.GroupId}&sn=${serialNumber}`}
                className={`btn btn-sm ${getCheckedClass(row)}`}
              >
                <FaListCheck />
              </Link>
            </OverlayTrigger>
          </div>
          <div className={`ms-1`}>
            <OverlayTrigger placement="top-start" overlay={<Tooltip>{t("print")}</Tooltip>}>
              <a
                className={`btn btn-sm ${getPrintQRClass(row)}`}
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
                onClick={() => setDeleteRecord({ row: row, ended: false })}
              >
                <FaTrash />
              </a>
            </OverlayTrigger>
          </div>
        </div>
      ),
    },
    {
      key: "Position",
      cell: (row: GenericRecord) => <>{getMachinePosition(row.Position)}</>,
    },
    {
      key: "MachineId",
      cell: (row: GenericRecord) => (
        <Link
          href={`/factory/devices?gid=${row.GroupId}&mid=${row.MachineId}&sn=${serialNumber}`}
          className="text-dark"
        >
          {row.MachineId}
        </Link>
      ),
    },
  ];

/*   const getPrintDevices = async (machine: GenericRecord) => {
    try {
      const response = await getFactoryMachinepDevices({
        GroupId: machine.GroupId,
        MachineId: machine.MachineId,
      });
      setDevices(response.data.result);
    } catch (error) {
      dispatch(setError(t("undefined_error")));
    }
  }; */
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const gid = searchParams.get("gid");
    const sn = searchParams.get("sn");
    setSerialNumber(sn ?? "");
    dispatch(setPage({ ...page, title: sn, infoPath: `${page.infoPath}?gid=${gid}&sn=${sn}` }));
    setStatus("prepared");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // hooks

  useSetTable(status, () => setStatus("ready"), tableConfig);

  const deleteMachine = async () => {
    console.log("delete", deleteRecord);
    if (!deleteRecord) return;

    try {
      const result = await deleteFactoryMachine(deleteRecord.row);
      if (result.data.success) {
        setDeleteRecord({ ...deleteRecord, ended: true });
        dispatch(setRefresh());
      }
    } catch (e) {
      console.log(e);
    }
  };

const printMachine = async () => {
    console.log("print", printRecord);
    if (!printRecord) return;
    try {
      const result = await getMachinePrintPdf(
        printRecord.row.GroupId,
        printRecord.row.MachineId
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
      <PageTableComponent metaColumns={metaColumns} />
      {deleteRecord && (
        <ModalComponent
          title={t("delete")}
          onAction={deleteMachine}
          onActionLabel={"delete"}
          onClose={() => {
            setDeleteRecord(null);
          }}
          closeButton={true}
        >
          {!deleteRecord.ended && (
            <>
              <div>{t("confirm_devices_delete")}</div>
              <div>
                {t("machine")} {deleteRecord.row.MachineId}
              </div>
            </>
          )}
          {deleteRecord.ended && (
            <>
              <div>{t("delete_executed_successfully")}</div>
              <div>
                {t("machine")} {deleteRecord.row.MachineId}
              </div>
            </>
          )}
        </ModalComponent>
      )}
      {devices.length > 0 && (
        <PrintPreview
          devices={devices}
          close={() => {
            setDevices([]);
          }}
        />
      )}
      {printRecord && (
        <ModalComponent
          title={t("print")}
          onAction={printMachine}
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
    </BackofficeMainTemplate>
  );
};

export default Machines;
