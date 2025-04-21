import { useEffect, useState } from "react";

import { GenericRecord } from "@/types";
import { FaTruck } from "react-icons/fa6";
import { FaListCheck } from "react-icons/fa6";
import { FaQrcode } from "react-icons/fa";
import BackofficeMainTemplate from "@/templates/BackofficeMainTemplate";
import useSetTable from "@/hooks/useSetTablePage";

import filters from "@/config/pages/factory/groups/filters";
import table from "@/config/pages/factory/groups/table";
import page from "@/config/pages/factory/groups/index";
import PageTableComponent from "@/templates/components/PageTableComponent";
import { useAppDispatch } from "@/redux/hooks";
import { setPage } from "@/slices/pageSlice";
import { useTranslation } from "@/context/contextUtils";
import FactoryDispatchModal from "@/components/factory/groups/FactoryDispatchModal";
import { setRefresh } from "@/slices/tableSlice";
import Link from "next/link";
import PrintPreview from "@/components/print/PrintPreview";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import FactoryMachineSerialNumberModal from "@/components/factory/groups/FactoryMachineSerialNumberModal";
import { FaTag } from "react-icons/fa";
import { getGroupPrintPdf } from "@/api/print";
import ModalComponent from "@/components/modal/ModalComponent";
import { printPdf } from "@/utils/print";


export const Groups = () => {
  // router
  const dispatch = useAppDispatch();

  const t = useTranslation();

  // states
  const [status, setStatus] = useState<string>("prepared"); // If there's nothing to load before rendering the page, it should be "prepared"
  const [dispatchGroup, setDispatchGroup] = useState<GenericRecord | null>(null);
  const [factoryMachineSerialNumberGroup, setFactoryMachineSerialNumberGroup] = useState<GenericRecord | null>(null);
  const [devices, setDevices] = useState<GenericRecord[]>([]);
  const [printRecord, setPrintRecord] = useState<GenericRecord | null>(null);

  const getDispatchClass = (row: GenericRecord) => {
    if (row.FactoryDispatched == row.Total) {
      return "btn-warning";
    } else if (row.FactoryDispatched == 0) {
      return "btn-primary";
    } else {
      return "btn-danger";
    }
  };
  const getDispatchIconClass = (row: GenericRecord) => {
    if (row.FactoryDispatched == row.Total) {
      return "icon-flipped";
    } else {
      return "";
    }
  };

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
      return "btn-secondary ";
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
                href={`/factory/machine_model?gid=${row.GroupId}&sn=${row.SerialNumber}`}
                className={`btn btn-sm ${getCheckedClass(row)}`}
              >
                <FaListCheck />
              </Link>
            </OverlayTrigger>
          </div>
          <div className={`ms-1`}>
            <OverlayTrigger placement="top-start" overlay={<Tooltip>{t("print")}</Tooltip>}>
              <a
                className={`btn btn-sm  ${getPrintQRClass(row)} `}
                onClick={() => setPrintRecord({ ended: false, row: row })}
              >
                <FaQrcode />
              </a>
            </OverlayTrigger>
          </div>

          <div className={`ms-1`}>
          <OverlayTrigger placement="top-start" overlay={<Tooltip>{row.FactoryDispatched == row.Total ? t("reenter") : t("dispatch")}</Tooltip>}>
            <a
              className={`btn btn-sm ${getDispatchClass(row)}`}
              onClick={() => setDispatchGroup(row)}
            >
              <FaTruck className={`${getDispatchIconClass(row)}`} />
            </a>
            </OverlayTrigger>
          </div>

          <div className={`ms-1`}>
            <OverlayTrigger placement="top-start" overlay={<Tooltip>{t("set_machine_factory_serial_number")}</Tooltip>}>
              <a
                className={`btn btn-sm btn-outline-dark `}
                onClick={() => setFactoryMachineSerialNumberGroup(row)}
              >
                <FaTag />
              </a>
            </OverlayTrigger>
          </div>

        </div>
      ),
    },
    {
      key: "SerialNumber",
      cell: (row: GenericRecord) => (
        <Link
          href={`/factory/machines?gid=${row.GroupId}&sn=${row.SerialNumber}`}
          className="text-dark"
        >
          {row.SerialNumber}
        </Link>
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

  const endDispatch = () => {
    dispatch(setRefresh());
    setDispatchGroup(null);
  };



  const printGroup = async () => {
    console.log("print", printRecord);
    if (!printRecord) return;
    try {
      const result = await getGroupPrintPdf(
        printRecord.row.GroupId
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
      {dispatchGroup && (
        <FactoryDispatchModal
          dispatchGroup={dispatchGroup}
          endDispatch={endDispatch}
          setDispatchGroup={setDispatchGroup}
        />
      )}
      {factoryMachineSerialNumberGroup && (
        <FactoryMachineSerialNumberModal
          factoryMachineSerialNumberGroup={factoryMachineSerialNumberGroup}
          setMachineSerialNumberGroup={setFactoryMachineSerialNumberGroup}
        />
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
          onAction={printGroup}
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

export default Groups;
