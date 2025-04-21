import { Fragment, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setError, setPage } from "@/slices/pageSlice";
import { getAllPermissions, getRole, updateRole } from "@/api/security";

import page from "@/config/pages/security/roles/edit";

import BackofficeMainTemplate from "@/templates/BackofficeMainTemplate";
import { GenericRecord } from "@/types";
import FormHeader from "@/components/form/FormHeader";
import FormWrapper from "@/components/form/FormWrapper";
import { setFlashMessage } from "@/slices/appSlice";
import { useTranslation } from "@/context/contextUtils";
import { useRouter } from "next/router";

import { getPagesTree } from "@/utils/navigation";
import { GetStaticProps } from "next";

interface PageNode {
  name: string;
  path: string;
  children?: PageNode[];
}

interface PageListProps {
  pagesTree: PageNode[];
}

export const getStaticProps: GetStaticProps = async () => {
  const pagesTree = getPagesTree(); // ✅ Obtiene el árbol de páginas
  console.log(pagesTree);
  return { props: { pagesTree } };
};

const renderOptions = (nodes: PageNode[], prefix: string = "") => {
  return nodes.map((node) => (
    <Fragment key={node.path}>
      <option value={node.path}>{prefix + node.name}</option>
      {node.children && renderOptions(node.children, prefix + "-- ")}
    </Fragment>
  ));
};

const RoleEdit = ({ pagesTree }:PageListProps) => {
  // redux
  const t = useTranslation();

  const router = useRouter();

  const userDataData = useAppSelector((state) => state.userData.data);
  const dispatch = useAppDispatch();

  // states

  const [record, setRecord] = useState<GenericRecord | null>(null);
  const [recordCurrent, setRecordCurrent] = useState<GenericRecord | null>(null);
  const [status, setStatus] = useState<string>("pending");
  const [permissions, setPermissions] = useState<GenericRecord[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);

  // Prepare page data
  useEffect(() => {
    if (userDataData == null || status != "pending") return;
    const preparePage = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const id = searchParams.get("id");

      if (!id) {
        router.push("/404");
        return;
      }

      try {
        const response = await getRole({ id: id });

        if (response.data.success === false) {
          if (response.data.message === "page_not_found") {
            router.push("/404");
          } else {
            dispatch(setFlashMessage({ message: t("bad_request"), type: "error" }));
          }
          return;
        }

        const data: GenericRecord = response.data.result;
        data.permissions = data.permissions.map((p: GenericRecord) => {
          return p.id;
        });
        response.data.result.permissions = data.permissions;
        setRecord(response.data.result);
        setRecordCurrent(response.data.result);
      } catch (error) {
        dispatch(setFlashMessage({ message: t("bad_request"), type: "warning" }));
        router.push(userDataData.roles[0].home_path);
        return;
      }

      try {
        const response = await getAllPermissions();
        setPermissions(response.data.result);
        setStatus("prepared");
      } catch (error) {
        dispatch(setFlashMessage({ message: t("bad_request"), type: "warning" }));
        router.push(userDataData.roles[0].home_path);
        return;
      }
    };
    preparePage();
  }, [userDataData, dispatch, refresh, router]); // eslint-disable-line

  // Store page data
  useEffect(() => {
    if (status != "prepared") return;

    dispatch(
      setPage({
        title: page.title,
        breadcrumb: page.breadcrumb,
      }),
    );
    setStatus("ready");
  }, [dispatch, status]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!recordCurrent) return;
    setStatus("pending");

    try {
      const response = await updateRole(recordCurrent);

      if (!response.data.success) {
        dispatch(setFlashMessage({ message: t(response.data.message), type: "danger" }));
      } else {
        dispatch(setFlashMessage({ message: t("update_executed_successfully"), type: "success" }));
      }
      setRefresh(!refresh);
    } catch (error) {
      dispatch(setError(t("operation_not_executed")));
      return;
    }
  };

  return (
    <BackofficeMainTemplate status={status}>
      <form onSubmit={handleSubmit} autoComplete="off" className="flex-grow-1 overflow-hidden d-flex flex-column">
        <FormHeader handleReset={() => setRecordCurrent(record)} />

        <FormWrapper>
          <div className="form-group">
            <label htmlFor="name">{t("name")}</label>
            <input
              required
              minLength={3}
              type="text"
              className="form-control"
              id="name"
              value={recordCurrent ? recordCurrent.name : ""}
              onChange={(e) => setRecordCurrent({ ...recordCurrent, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="home_path">{t("home")}</label>
            <select
              id="home_path"
              name="home_path"
              className="form-control"
              value={recordCurrent ? recordCurrent.home_path : ""}
              onChange={(e) => setRecordCurrent({ ...recordCurrent, home_path: e.target.value })}
            >
              {renderOptions(pagesTree)}
            </select>
          </div>
          <div className="permissions">
            {permissions.map((permission: GenericRecord) => (
              <div key={permission.id} className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={permission.id}
                  id={`permission-${permission.id}`}
                  checked={recordCurrent?.permissions.includes(permission.id) ? true : false}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setRecordCurrent({
                        ...recordCurrent,
                        permissions: [...recordCurrent?.permissions, permission.id],
                      });
                    } else {
                      setRecordCurrent({
                        ...recordCurrent,
                        permissions: recordCurrent?.permissions.filter(
                          (p: number) => p != permission.id,
                        ),
                      });
                    }
                  }}
                />
                <label className="form-check-label" htmlFor={`permission-${permission.id}`}>
                  {permission.name}
                </label>
              </div>
            ))}
          </div>
        </FormWrapper>
      </form>
    </BackofficeMainTemplate>
  );
};
export default RoleEdit;
