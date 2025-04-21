import { undispatchFactoryDevices } from "@/api/factory";
import ModalComponent from "@/components/modal/ModalComponent";
import { useTranslation } from "@/context/contextUtils";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setError } from "@/slices/pageSlice";
import { GenericRecord } from "@/types";
import React, { memo,  useState } from "react";

/**
 * Print controls component.
 */

const FactoryReenterDevicesModal = ({
    endUndispatchDevices
}: {
    endUndispatchDevices: () => void;
}) => {

    const t = useTranslation();
    const dispatch = useAppDispatch();
    const [updated, setUpdated] = useState<boolean>(false);

    const tableDataSelectedRows = useAppSelector((state) => state.tableData.selectedRows);


    const handleUndispatch = async () => {
        console.log("dispatch");

        try {
            const response = await undispatchFactoryDevices({ devices: tableDataSelectedRows.filter(item => item.FactoryDispatched == 1) });

            if (response.data.success) {
                setUpdated(true);
            }

        } catch (error) {
            dispatch(setError(t("operation_not_executed")));
        }


    }


    return (
        <>
            {tableDataSelectedRows.length > 0 && <ModalComponent title={t("no_dispatch_devices_question")} closeButton={true} onClose={() =>
                endUndispatchDevices()} dismissible={false} onActionLabel={updated ? "" : "reenter"} onAction={handleUndispatch}>

                {!updated && <div className="d-flex flex-column">


                    <div className="mt-2">
                        <label>{t("devices")}</label>
                        <div className="form-control overflow-auto" style={{ maxHeight: "200px" }}>{
                            tableDataSelectedRows.filter((item) => item.FactoryDispatched == 1).map((device: GenericRecord, index: number) => {
                                return (
                                    <div key={index}>
                                        {device.Id}
                                    </div>
                                );
                            })
                        }</div>
                    </div>
                </div>}
                {updated && <div className="d-flex flex-column text-success">

                    {t("operation_executed_successfully")}
                </div>}
            </ModalComponent>}

        </>
    );
};
export default memo(FactoryReenterDevicesModal);
