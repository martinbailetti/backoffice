import { memo } from "react";
import { GenericRecord } from "@/types";

import { FaList } from "react-icons/fa";
import { IoSearch, IoVideocam } from "react-icons/io5";

export const ListFooter = ({
  view,
  setView,
  filters,
}: {
  view: string;
  setView: (value: string) => void;
  filters: GenericRecord[];
}) => {
  return (
    <div className="d-flex justify-content-around align-items-center">
      <div>
        <a
          className={`position-relative btn btn-outline-info h4 my-2 ${view == "list" ? "active" : ""}`}
          onClick={() => setView("list")}
        >
          <FaList />
        </a>
      </div>
      <div>
        <a
          className={`btn btn-outline-info h4 my-2 ${view == "search" ? "active" : ""} position-relative`}
          onClick={() => setView("search")}
        >
          <IoSearch />
          {filters.length > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-black">
              {filters.length}
            </span>
          )}
        </a>
      </div>
      <div>
        <a
          className={`btn btn-outline-info h4 my-2 ${view == "scanner" ? "active" : ""}`}
          onClick={() => setView("scanner")}
        >
          <IoVideocam />
        </a>
      </div>
    </div>
  );
};

export default memo(ListFooter);
