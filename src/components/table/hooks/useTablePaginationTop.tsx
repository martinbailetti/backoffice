import { useEffect } from "react";
import { GenericRecord } from "@/types";

const useTablePaginationTop = (paginationRef: React.RefObject<HTMLDivElement>, data: GenericRecord[]) => {

  useEffect(() => {
    if (paginationRef.current) {
      const pagination = document.querySelector(
        ".table-container .rdt_Pagination",
      ) as HTMLDivElement;

      if (pagination) {
        const clonedPagination = pagination.cloneNode(true) as HTMLDivElement;
        clonedPagination.querySelectorAll("[id]").forEach((element) => {
          const el = element as HTMLElement;
          el.id = `${el.id}-top`;
        });
        paginationRef.current.innerHTML = "";
        paginationRef.current.appendChild(clonedPagination);

        clonedPagination
          .querySelector("#pagination-first-page-top")
          ?.addEventListener("click", () => {

            (document.querySelector("#pagination-first-page") as HTMLElement)?.dispatchEvent(
              new MouseEvent("click", { bubbles: true }),
            );
          });

        clonedPagination
          .querySelector("#pagination-previous-page-top")
          ?.addEventListener("click", () => {

            (document.querySelector("#pagination-previous-page") as HTMLElement)?.dispatchEvent(
              new MouseEvent("click", { bubbles: true }),
            );
          });

        clonedPagination
          .querySelector("#pagination-next-page-top")
          ?.addEventListener("click", () => {

            (document.querySelector("#pagination-next-page") as HTMLElement)?.dispatchEvent(
              new MouseEvent("click", { bubbles: true }),
            );
          });

        clonedPagination
          .querySelector("#pagination-last-page-top")
          ?.addEventListener("click", () => {

            (document.querySelector("#pagination-last-page") as HTMLElement)?.dispatchEvent(
              new MouseEvent("click", { bubbles: true }),
            );
          });

        paginationRef.current.querySelector("select")?.addEventListener("change", (e) => {
          const target = e.target as HTMLSelectElement;

          (document.querySelector(".table-container select") as HTMLSelectElement).value = target.value;
          (document.querySelector(".table-container select") as HTMLSelectElement)?.dispatchEvent(
            new Event("change", { bubbles: true }),
          );


        });
      }
    }
  }, [data, paginationRef]);

};

export default useTablePaginationTop;
