import { dispatchFactoryGroup, enterFactoryGroup, getFactoryClients } from "@/api/factory";
import ModalComponent from "@/components/modal/ModalComponent";
import { useTranslation } from "@/context/contextUtils";
import { useAppDispatch } from "@/redux/hooks";
import { setError } from "@/slices/pageSlice";
import { GenericRecord } from "@/types";
import React, { memo, useEffect, useState } from "react";

/**
 * Print controls component.
 */

const FactoryDispatchModal = ({
    dispatchGroup,
    endDispatch,
    setDispatchGroup
}: {
    dispatchGroup: GenericRecord;
    endDispatch: () => void;
    setDispatchGroup: (group: GenericRecord | null) => void;
}) => {

    const t = useTranslation();
    const dispatch = useAppDispatch();
    const [clients, setClients] = useState<GenericRecord[]>([]);
    const [updated, setUpdated] = useState<boolean>(false);

    const [recordCurrent, setRecordCurrent] = useState<GenericRecord>({ FactoryDispatchedDate: '', client: '' });

    // Prepare page data
    useEffect(() => {

        const getClients = async () => {

            try {
                const response = await getFactoryClients();
                setClients(response.data.result);
            } catch (error) {
                dispatch(setError(t("undefined_error")));
            }


        };

        getClients();
    }, [dispatch]); // eslint-disable-line

    const renderClients = () => {

        return clients.map((client: GenericRecord) => {
            return (
                <option key={client.id} value={client.id}>
                    {client.name}
                </option>
            );
        });
    }
    const handleDispatch = async () => {
        console.log("dispatch");
        if (recordCurrent.client != "" && recordCurrent.FactoryDispatchedDate != "") {

            try {
                const response = await dispatchFactoryGroup({ ...recordCurrent, GroupId: dispatchGroup.GroupId });

                if (response.data.success) {
                    setUpdated(true);
                }

            } catch (error) {
                dispatch(setError(t("operation_not_executed")));
            }



        }
    }
    const handleEnter = async () => {

        try {
            const response = await enterFactoryGroup({ ...recordCurrent, GroupId: dispatchGroup.GroupId });

            if (response.data.success) {
                setUpdated(true);
            }

        } catch (error) {
            dispatch(setError(t("operation_not_executed")));
        }


    }

    return (
        <>
            {dispatchGroup && dispatchGroup.FactoryDispatched < dispatchGroup.Total && <ModalComponent title={t("dispatch_machine_question")} closeButton={true} onClose={!updated ? () => setDispatchGroup(null) : () => endDispatch()} dismissible={false} onActionLabel={updated ? "" : "dispatch"} onAction={handleDispatch}>

                {!updated && <div className="d-flex flex-column">
                    <div>
                        <label>{t("group")}</label>
                        <div className="form-control">{dispatchGroup.GroupId}</div>
                    </div>
                    <div>
                        <label htmlFor="clients">{t("client")}</label>
                        <select className="form-select" id="clients" value={recordCurrent.client} onChange={(e) => setRecordCurrent({ ...recordCurrent, client: e.target.value })}>
                            <option value="">{t("select")}</option>
                            {renderClients()}
                        </select>
                    </div>
                    <div className="mt-2">
                        <label htmlFor="date">{t("dispatch_date")}</label>
                        <input type="date" className="form-select" id="date" value={recordCurrent.FactoryDispatchedDate} onChange={(e) => setRecordCurrent({ ...recordCurrent, FactoryDispatchedDate: e.target.value })} />
                    </div>
                </div>}
                {updated && <div className="d-flex flex-column text-success">

                    {t("operation_executed_successfully")}
                </div>}
            </ModalComponent>}
            {dispatchGroup && dispatchGroup.FactoryDispatched == dispatchGroup.Total && <ModalComponent title={t("no_dispatch_machine_question")} closeButton={true} onClose={!updated ? () => setDispatchGroup(null) : () => endDispatch()} dismissible={false} onActionLabel={updated ? "" : "enter"} onAction={handleEnter}>

                {!updated && <div className="d-flex flex-column">

                    <div>
                        <label>{t("group")}</label>
                        <div className="form-control">{dispatchGroup.GroupId}</div>
                    </div>

                </div>}
                {updated && <div className="d-flex flex-column text-success">

                    {t("operation_executed_successfully")}
                </div>}
            </ModalComponent>}
        </>
    );
};
export default memo(FactoryDispatchModal);
