import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setError, setPage } from "@/slices/pageSlice";
import BackofficeMainTemplate from "@/templates/BackofficeMainTemplate";
import { useEffect, useState } from "react";
import page from "@/config/pages/admin/index";
import { useTranslation } from "@/context/contextUtils";
import { CgDanger } from "react-icons/cg";

import { FaCalendarDay } from "react-icons/fa6";
import { FaCalendarXmark } from "react-icons/fa6";
import { GrValidate } from "react-icons/gr";
import { TbLock } from "react-icons/tb";
import { FaDoorClosed } from "react-icons/fa";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { MdCategory } from "react-icons/md";
import { IoShapes } from "react-icons/io5";
import { getActivatingDevices,  getExpiration, getExpirationNoDate, getNewDevices, getNewExpirationDevices, getNewGroups, getNewMachines, getPendingExpiration, getQuarantine, getQuarantineMachines } from "@/api/licenses";
import { GenericRecord } from "@/types";
import Link from "next/link";

export default function AdminHome() {
  const userDataData = useAppSelector((state) => state.userData.data);

  const dispatch = useAppDispatch();

  const t = useTranslation();


  const [activatingDevices, setActivatingDevices] = useState<GenericRecord>({ loaded: false, data: [] });
  const [expirationNoDateDevices, setExpirationNoDateDevices] = useState<GenericRecord>({ loaded: false, data: [] });
  const [expirationDevices, setExpirationDevices] = useState<GenericRecord>({ loaded: false, data: [] });
  const [quarantineDevices, setQuarantineDevices] = useState<GenericRecord>({ loaded: false, data: [] });
  const [quarantineMachines, setQuarantineMachines] = useState<GenericRecord>({ loaded: false, data: [] });
  const [pendingExpiration10DaysDevices, setPendingExpiration10DaysDevices] = useState<GenericRecord>({ loaded: false, data: [] });
  const [pendingExpiration1DayDevices, setPendingExpiration1DayDevices] = useState<GenericRecord>({ loaded: false, data: [] });
  const [newGroups, setNewGroups] = useState<GenericRecord>({ loaded: false, data: [] });
  const [newMachines, setNewMachines] = useState<GenericRecord>({ loaded: false, data: [] });
  const [newDevices, setNewDevices] = useState<GenericRecord>({ loaded: false, data: [] });
  const [newExpirationDevices, setNewExpirationDevices] = useState<GenericRecord>({ loaded: false, data: [] });

  const [view, setView] = useState<string>("default");



  useEffect(() => {
    dispatch(
      setPage({
        ...page,
      }),
    );
  }, [dispatch]);


  useEffect(() => {

    if (userDataData == null) return;

    const loadActivatingDevices = async () => {

      try {
        const response = await getActivatingDevices();
        setActivatingDevices({ loaded: true, data: response.data.result });
      } catch (error) {
        dispatch(setError(t("undefined_error")));
      }
    };
    const loadExpirationNoDateDevices = async () => {

      try {
        const response = await getExpirationNoDate();
        setExpirationNoDateDevices({ loaded: true, data: response.data.result });
      } catch (error) {
        dispatch(setError(t("undefined_error")));
      }
    };
    const loadExpirationDevices = async () => {

      try {
        const response = await getExpiration();
        setExpirationDevices({ loaded: true, data: response.data.result });
      } catch (error) {
        dispatch(setError(t("undefined_error")));
      }
    };
    const loadQuarantineDevices = async () => {

      try {
        const response = await getQuarantine();
        setQuarantineDevices({ loaded: true, data: response.data.result });
      } catch (error) {
        dispatch(setError(t("undefined_error")));
      }
    };
    const loadQuarantineMachines = async () => {

      try {
        const response = await getQuarantineMachines();
        setQuarantineMachines({ loaded: true, data: response.data.result });
      } catch (error) {
        dispatch(setError(t("undefined_error")));
      }
    };
    const loadPendingExpiration10daysDevices = async () => {

      try {
        const response = await getPendingExpiration({ days: 10 });
        setPendingExpiration10DaysDevices({ loaded: true, data: response.data.result });
      } catch (error) {
        dispatch(setError(t("undefined_error")));
      }
    };
    const loadPendingExpiration1dayDevices = async () => {

      try {
        const response = await getPendingExpiration({ days: 1 });
        setPendingExpiration1DayDevices({ loaded: true, data: response.data.result });
      } catch (error) {
        dispatch(setError(t("undefined_error")));
      }
    };
    const loadNewGroups = async () => {

      try {
        const response = await getNewGroups();
        setNewGroups({ loaded: true, data: response.data.result });
      } catch (error) {
        dispatch(setError(t("undefined_error")));
      }
    };
    const loadNewMachines = async () => {

      try {
        const response = await getNewMachines();
        setNewMachines({ loaded: true, data: response.data.result });
      } catch (error) {
        dispatch(setError(t("undefined_error")));
      }
    };
    const loadNewDevices = async () => {

      try {
        const response = await getNewDevices();
        setNewDevices({ loaded: true, data: response.data.result });
      } catch (error) {
        dispatch(setError(t("undefined_error")));
      }
    };

    const loadNewExpirationDevices = async () => {

      try {
        const response = await getNewExpirationDevices();
        setNewExpirationDevices({ loaded: true, data: response.data.result });
      } catch (error) {
        dispatch(setError(t("undefined_error")));
      }
    };


    loadActivatingDevices();
    loadExpirationNoDateDevices();
    loadExpirationDevices();
    loadQuarantineDevices();
    loadPendingExpiration10daysDevices();
    loadPendingExpiration1dayDevices();
    loadNewGroups();
    loadNewMachines();
    loadNewDevices();
    loadNewExpirationDevices();
    loadQuarantineMachines();

  }, [userDataData, dispatch]); // eslint-disable-line





  const renderLoading = () => {

    return <div className="spinner-grow spinner-grow-sm text-secondary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  }

  const renderNewGroups = () => {

    return newGroups.data.map((group: GenericRecord) => {

      return <Link key={group.GroupId} className="mb-2" href={`licenses/machines?gid=${group.GroupId}`}>
        {group.GroupId}
      </Link>
    })

  }

  const renderNewMachines = () => {

    const groupedMachines = newMachines.data.reduce((acc: GenericRecord, machine: GenericRecord) => {
      if (!acc[machine.GroupId]) {
        acc[machine.GroupId] = [];
      }
      acc[machine.GroupId].push(machine.MachineId);
      return acc;
    }, {});

    console.log("groupedMachines",groupedMachines);

    // Renderizar el HTML
    return Object.keys(groupedMachines).map((groupId) => (
      <div key={groupId} className="mb-4">
        <Link href={`licenses/machines?gid=${groupId}`} className="fw-bold text-dark">{groupId}</Link>
        <ul>
          {groupedMachines[groupId].map((machineId: string) => (
            <li key={machineId}><Link href={`licenses/machines?gid=${groupId}&mid=${machineId}`} className="text-dark" >{machineId}</Link></li>
          ))}
        </ul>
      </div>
    ));
  }


  const renderDevices = (devices:GenericRecord[]) => {
    // Agrupar por GroupId y luego por MachineId
    const groupedDevices = devices.reduce((acc: GenericRecord, device: GenericRecord) => {
      if (!acc[device.GroupId]) {
        acc[device.GroupId] = {};
      }
      if (!acc[device.GroupId][device.MachineId]) {
        acc[device.GroupId][device.MachineId] = [];
      }
      acc[device.GroupId][device.MachineId].push(device.Id);
      return acc;
    }, {});

    // Renderizar el HTML
    return Object.keys(groupedDevices).map((groupId) => (
      <div key={groupId} className="mb-4">
        <Link href={`licenses/machines?gid=${groupId}`} className="fw-bold text-dark">{groupId}</Link>
        {Object.keys(groupedDevices[groupId]).map((machineId) => (
          <ul key={machineId} className="mb-2">
            <li>
            <Link href={`licenses/devices?gid=${groupId}&mid=${machineId}`} className="fw-bold text-dark">{machineId}</Link>
            <ul>
              {groupedDevices[groupId][machineId].map((deviceId: string) => (
                <li key={deviceId}><Link href={`licenses/devices/device?gid=${groupId}&mid=${machineId}&Id=${deviceId}`} className="text-dark">{deviceId}</Link></li>
              ))}
            </ul>
            </li>
          </ul>
        ))}
      </div>
    ));
  };


  return (
    <BackofficeMainTemplate status="ready">
      <div className="flex-grow-1 overflow-auto pb-3">
        {view == "default" && <>
          <div className="row justify-content-center max-width-md-900px mx-auto">
            <div className="col-12 text-center fs-4 fw-bold text-uppercase pb-3">{t("new")}</div>
            <div className="col-md-4 col-12 text-center pt-2">
              <div className="d-flex justify-content-between cursor-pointer" onClick={() => newGroups.data.length > 0 && setView("newGroups")}>
                <div>
                  <BiSolidCategoryAlt className="fs-lg text-success" />
                </div>
                <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center">
                  <div className="text-dark fw-bold">{t("groups")}</div>
                  <div className="text-dark fs-3 fw-bold lh-1">{!newGroups.loaded ? renderLoading() : newGroups.data.length}</div>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-12 text-center pt-2">
              <div className="d-flex justify-content-between cursor-pointer" onClick={() => newMachines.data.length > 0 && setView("newMachines")}>
                <div>
                  <MdCategory className="fs-lg text-info" />
                </div>
                <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center">
                  <div className="text-dark fw-bold">{t("machines")}</div>
                  <div className="text-dark fs-3 fw-bold lh-1">{!newMachines.loaded ? renderLoading() : newMachines.data.length}</div>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-12 text-center pt-2">
              <div className="d-flex justify-content-between cursor-pointer" onClick={() => newDevices.data.length > 0 && setView("newDevices")}>
                <div>
                  <IoShapes className="fs-lg text-dark" />
                </div>
                <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center">
                  <div className="text-dark fw-bold">{t("devices")}</div>
                  <div className="text-dark fs-3 fw-bold lh-1">{!newDevices.loaded ? renderLoading() : newDevices.data.length}</div>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-12 text-center pt-2">
              <div className="d-flex justify-content-between cursor-pointer" onClick={() => newDevices.data.length > 0 && setView("newExpirationDevices")}>
                <div>
                  <IoShapes className="fs-lg text-danger" />
                </div>
                <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center">
                  <div className="text-dark fw-bold lh-1">{t("devices_expiration_connected")}</div>
                  <div className="text-dark fs-3 fw-bold lh-1">{!newExpirationDevices.loaded ? renderLoading() : newExpirationDevices.data.length}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="row justify-content-center max-width-md-900px mx-auto mt-3">
            <div className="col-12 text-center fs-4 fw-bold text-uppercase pb-2 mt-3">{t("devices")}</div>
            <div className="col-md-3 col-12 text-center">
              <div className="cursor-pointer" onClick={() => newGroups.data.length > 0 && setView("expirationDevices")}>
                <div>
                  <CgDanger className="fs-1 mt-3 text-danger" />
                </div>
                <div className="fs-5 mt-2 fw-bold">{!expirationDevices.loaded ? renderLoading() : expirationDevices.data.length}</div>
                <div className="text-dark">{t("devices_0_1_expiration_connected")}</div>
              </div>
            </div>
            <div className="col-md-3 col-12 text-center">
              <div className="cursor-pointer">
                <div>
                  <FaCalendarXmark className="fs-1 mt-3 text-danger-emphasis" />
                </div>
                <div className="fs-5 mt-2 fw-bold">{!expirationNoDateDevices.loaded ? renderLoading() : expirationNoDateDevices.data.length}</div>
                <div className="text-dark">{t("devices_expiration_no_date_connected")}</div>
              </div>
            </div>
            <div className="col-md-3 col-12 text-center">
              <div className="cursor-pointer" onClick={() => pendingExpiration10DaysDevices.data.length > 0 && setView("pendingExpiration10DaysDevices")}>
                <div>
                  <FaCalendarDay className="fs-1 mt-3 text-warning" />
                </div>
                <div className="fs-5 mt-2 fw-bold">{!pendingExpiration10DaysDevices.loaded ? renderLoading() : pendingExpiration10DaysDevices.data.length}</div>
                <div className="text-dark">{t("expiration_less_10_days")}</div>
              </div>
            </div>
            <div className="col-md-3 col-12 text-center">
              <div className="cursor-pointer" onClick={() => pendingExpiration1DayDevices.data.length > 0 && setView("pendingExpiration1DayDevices")}>
                <div>
                  <FaCalendarDay className="fs-1 mt-3 text-danger" />
                </div>
                <div className="fs-5 mt-2 fw-bold">{!pendingExpiration1DayDevices.loaded ? renderLoading() : pendingExpiration1DayDevices.data.length}</div>
                <div className="text-dark">{t("expiration_less_1_day")}</div>
              </div>
            </div>
            <div className="col-md-3 col-12 text-center">
              <div className="cursor-pointer" onClick={() => activatingDevices.data.length > 0 && setView("activatingDevices")}>
                <div>
                  <GrValidate className="fs-1 mt-3 text-success" />
                </div>
                <div className="fs-5 mt-2 fw-bold">{!activatingDevices.loaded ? renderLoading() : activatingDevices.data.length}</div>
                <div className="text-dark">{t("in_validation_process")}</div>
              </div>
            </div>
            <div className="col-md-3 col-12 text-center">
              <div className="cursor-pointer" onClick={() => quarantineDevices.data.length > 0 && setView("quarantineDevices")}>
                <div>
                  <TbLock className="fs-1 mt-3 text-dark" />
                </div>
                <div className="fs-5 mt-2 fw-bold">{!quarantineDevices.loaded ? renderLoading() : quarantineDevices.data.length}</div>
                <div className="text-dark">{t("quarantined_devices")}</div>
              </div>
            </div>
            <div className="col-md-3 col-12 text-center">
              <div className="cursor-pointer">
                <div>
                  <FaDoorClosed className="fs-1 mt-3 text-danger-emphasis" />
                </div>
                <div className="fs-5 mt-2 fw-bold">0</div>
                <div className="text-dark">{t("quarantined_machines")}</div>
              </div>
            </div>
          </div>
        </>}

        {view !== "default" && <div className="text-end">
          <a className="btn btn-dark" onClick={() => setView("default")}>{t("back")}</a>

        </div>}
        {view == "newGroups" && <>
          <div className="fw-bold fs-5 text-uppercase mb-2">{t("new")} {t("groups")}</div>
          {renderNewGroups()}
        </>}
        {view == "newMachines" && <>
          <div className="fw-bold fs-5 text-uppercase mb-2">{t("new")} {t("machines")}</div>
          {renderNewMachines()}
        </>}
        {view == "newDevices" && <>
          <div className="fw-bold fs-5 text-uppercase mb-2">{t("new")} {t("devices")}</div>
          {renderDevices(newDevices.data)}
        </>}
        {view == "newExpirationDevices" && <>
          <div className="fw-bold fs-5 text-uppercase mb-2">{t("new")} {t("devices_0_1_expiration_connected")}</div>
          {renderDevices(newExpirationDevices.data)}
        </>}
        {view == "expirationNoDateDevices" && <>
          <div className="fw-bold fs-5 text-uppercase mb-2">{t("devices_expiration_no_date_connected")}</div>
          {renderDevices(expirationNoDateDevices.data)}
        </>}
        {view == "pendingExpiration10DaysDevices" && <>
          <div className="fw-bold fs-5 text-uppercase mb-2">{t("expiration_less_10_days")}</div>
          {renderDevices(pendingExpiration10DaysDevices.data)}
        </>}
        {view == "pendingExpiration1DayDevices" && <>
          <div className="fw-bold fs-5 text-uppercase mb-2">{t("expiration_less_1_day")}</div>
          {renderDevices(pendingExpiration1DayDevices.data)}
        </>}
        {view == "activatingDevices" && <>
          <div className="fw-bold fs-5 text-uppercase mb-2">{t("in_validation_process")}</div>
          {renderDevices(activatingDevices.data)}
        </>}
        {view == "quarantineDevices" && <>
          <div className="fw-bold fs-5 text-uppercase mb-2">{t("quarantined_devices")}</div>
          {renderDevices(quarantineDevices.data)}
        </>}
        {view == "quarantineMachines" && <>
          <div className="fw-bold fs-5 text-uppercase mb-2">{t("quarantined_machines")}</div>
          {renderDevices(quarantineMachines.data)}
        </>}
      </div>
    </BackofficeMainTemplate>
  );
}
