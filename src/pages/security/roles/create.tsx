import { Fragment, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setError, setPage } from "@/slices/pageSlice";
import { createRole, getAllPermissions } from "@/api/security";

import page from "@/config/pages/security/roles/create";

import BackofficeMainTemplate from "@/templates/BackofficeMainTemplate";
import { GenericRecord } from "@/types";
import FormHeader from "@/components/form/FormHeader";
import FormWrapper from "@/components/form/FormWrapper";
import { useRouter } from "next/router";
import { setFlashMessage } from "@/slices/appSlice";

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
const RoleCreate = ({ pagesTree }:PageListProps) => {
  // redux
  const userDataData = useAppSelector((state) => state.userData.data);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // states

  const [recordCurrent, setRecordCurrent] = useState<GenericRecord>({ name: "", home_path: "", permissions: [] });
  const [status, setStatus] = useState<string>("pending");
  const [permissions, setPermissions] = useState<GenericRecord[]>([]);

  // Prepare page data
  useEffect(() => {
    if (userDataData == null) return;
    const preparePage = async () => {

      try {
        const response = await getAllPermissions();
        setPermissions(response.data.result);
        setStatus("prepared");
      } catch (error) {
        dispatch(setError("Error fetching"));
        return;
      }
    };
    preparePage();
  }, [userDataData, dispatch]);

  // Store page data
  useEffect(() => {
    if (userDataData && status != "prepared") return;

    dispatch(
      setPage({
        title: page.title,
        breadcrumb: page.breadcrumb,
      }),
    );
    setStatus("ready");
  }, [dispatch, status, userDataData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await createRole(recordCurrent);

      setRecordCurrent(response.data.result);
      dispatch(setFlashMessage({ message: "Role created", type: "success" }));
      router.push(`/security/roles/edit?id=${response.data.result.id}`);
    } catch (error) {
      dispatch(setError("Error updating"));
    }
    setStatus("prepared");
  };

  return (
    <BackofficeMainTemplate status={status}>
      <form onSubmit={handleSubmit} autoComplete="off" className="flex-grow-1 overflow-hidden d-flex flex-column">
        <FormHeader  handleReset={() => setRecordCurrent({ name: "", permissions: [] })} />

        <FormWrapper>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              required
              minLength={3}
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={recordCurrent ? recordCurrent.name : ""}
              onChange={(e) => setRecordCurrent({ ...recordCurrent, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="home_path">Home</label>
            <select
              required
              id="home_path"
              name="home_path"
              className="form-control"
              value={recordCurrent ? recordCurrent.home_path : ""}
              onChange={(e) => setRecordCurrent({ ...recordCurrent, home_path: e.target.value })}
            >
              <option value="">Select</option>
              {renderOptions(pagesTree)}
            </select>
          </div>
          <div className="permissions">
            {permissions.map((permission) => (
              <div key={permission.id} className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={permission.id}
                  id={`permission-${permission.id}`}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setRecordCurrent({
                        ...recordCurrent,
                        permissions: [...recordCurrent.permissions, permission.id],
                      });
                    } else {
                      setRecordCurrent({
                        ...recordCurrent,
                        permissions: recordCurrent.permissions.filter(
                          (p: GenericRecord) => p != permission.id,
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
export default RoleCreate;
