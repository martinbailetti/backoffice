import { GenericRecord } from "@/types";
import { getFilters } from "@/utils/filters";
import { getColumns, getSerializedColumns } from "@/utils/table";
import {
  getStoredJson,
  hasStoredTableConfig,
  storeColumns,
  storeFilters,
  storeTableConfig,
  storeTableConfigProperty,
} from "@/utils/tableStorage";
import { createSlice } from "@reduxjs/toolkit";
interface TableState {
  rowTitle: string; // Row title
  page: number; // Table page
  paginationRowsPerPage: number; // Table rows per page
  loading: boolean; // Table loading
  onlyFilteredQueries: boolean; // Table loading
  result: {
    data: string;
    success: string;
    message: string;
    apiFunction: string;
    params?: GenericRecord[];
  }; // Table result
  selectedRows: GenericRecord[]; // Selected rows
  selectedRow: GenericRecord | null; // Selected row
  multiActionsModal: boolean; // Multi actions modal visibility
  rowActionsModal: boolean; // Row actions modal visibility
  token: string; // Page Unique token
  columns: GenericRecord[];
  sort: GenericRecord | null;

  multiActions: GenericRecord[];
  rowActions: GenericRecord[];
  customStyles?: GenericRecord | null;
  customHeadStyles?: GenericRecord | null;
  paginationRowsPerPageOptions?: number[];
  filters: GenericRecord[]; // Filters
  selectedFilter: GenericRecord | null; // Selected filter
  refresh: boolean; // Refresh table
  fixedHeight: boolean; // Refresh table
}
const initialState: TableState = {
  rowTitle: "",
  sort: null,
  page: 1,
  paginationRowsPerPage: 10,
  loading: false,
  onlyFilteredQueries: false,
  result: { data: "", success: "", message: "", apiFunction: "", params: [] },
  selectedRows: [],
  selectedRow: null,
  multiActionsModal: false,
  rowActionsModal: false,
  token: "",
  columns: [],
  multiActions: [],
  rowActions: [],
  customStyles: null,
  customHeadStyles: null,
  paginationRowsPerPageOptions: [10, 25, 50, 100],
  filters: [],
  selectedFilter: null,
  refresh: false,
  fixedHeight: false,
};
export const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    setTable: (state, action) => {
      if (action.payload.filters) {
        action.payload.filters = action.payload.filters.map((filter: GenericRecord) => ({
          ...filter,
          applied: filter.applied ?? false,
          translate: filter.translate ?? false,
          value: filter.value ?? [],
          value_label: filter.value ?? [],
          multi: filter.multi ?? false,
        }));

      }
      const data = {
        paginationRowsPerPage:
          action.payload.paginationRowsPerPage ?? initialState.paginationRowsPerPage,
        page: action.payload.page ?? initialState.page,
        columns: action.payload.columns ?? initialState.columns,
        sort: action.payload.sort ?? initialState.sort,
        filters: action.payload.filters,
      };
      let storedTableConfig = null;
      const hasStored = hasStoredTableConfig(action.payload.token, data);

      if (hasStored) {
        storedTableConfig = getStoredJson(action.payload.token);

        if (storedTableConfig) {
          storedTableConfig.columns = getColumns(action.payload.columns, storedTableConfig.columns);
          storedTableConfig.filters = getFilters(action.payload.filters, storedTableConfig.filters);
        }
      } else {
        storeTableConfig(action.payload.token, data);
      }

      state.filters = storedTableConfig ? storedTableConfig.filters : data.filters;

      const applied = state.filters.filter((filter: GenericRecord) => filter.applied);
      const selectedFilter = state.filters.find(
        (filter: GenericRecord) => filter.selected === true,
      );

      if (applied.length == 0) {
        state.selectedFilter = selectedFilter ? selectedFilter : null;
      }

      state.rowTitle = action.payload.rowTitle ?? initialState.rowTitle;
      state.token = action.payload.token ?? initialState.token;
      state.rowActions = action.payload.rowActions ?? initialState.rowActions;
      state.multiActions = action.payload.multiActions ?? initialState.multiActions;
      state.onlyFilteredQueries = action.payload.onlyFilteredQueries ?? initialState.onlyFilteredQueries;
      state.fixedHeight = action.payload.fixedHeight ?? initialState.fixedHeight;

      state.paginationRowsPerPage = storedTableConfig
        ? storedTableConfig.paginationRowsPerPage
        : data.paginationRowsPerPage;

      state.page = storedTableConfig ? storedTableConfig.page : data.page;
      state.sort = storedTableConfig && storedTableConfig.sort ? storedTableConfig.sort : data.sort;
      state.columns = storedTableConfig ? storedTableConfig.columns : data.columns;

      state.customStyles = action.payload.customStyles ?? initialState.customStyles;
      state.customHeadStyles = action.payload.customHeadStyles ?? initialState.customHeadStyles;
      state.result = action.payload.result ?? initialState.result;
      state.paginationRowsPerPageOptions =
        action.payload.paginationRowsPerPageOptions ?? initialState.paginationRowsPerPageOptions;
    },
    setSort: (state, action) => {
      state.sort = action.payload;
      storeTableConfigProperty(state.token, "sort", action.payload);
    },
    setRowsPerPage: (state, action) => {
      state.paginationRowsPerPage = action.payload;
      storeTableConfigProperty(state.token, "paginationRowsPerPage", action.payload);
    },
    setPage: (state, action) => {
      state.page = action.payload;
      storeTableConfigProperty(state.token, "page", action.payload);
    },
    setColumns: (state, action) => {
      state.columns = action.payload;

      storeColumns(state.token, getSerializedColumns(action.payload));
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
      state.selectedRows = [];
    },
    setSelectedRows: (state, action) => {
      state.selectedRows = action.payload;
    },
    setSelectedRow: (state, action) => {
      state.selectedRow = action.payload;
    },
    setMultiActionsModal: (state, action) => {
      state.multiActionsModal = action.payload;
    },
    setRowActionsModal: (state, action) => {
      state.rowActionsModal = action.payload;
    },

    applyFilter: (state, action) => {
      const filterIndex = state.filters.findIndex((filter) => filter.id === action.payload.id);

      if (filterIndex !== -1) {
        state.filters[filterIndex] = {
          ...state.filters[filterIndex],
          applied: true,
          selected: false,
          value: [...state.filters[filterIndex].value, action.payload.value],
        };
        if (action.payload.value_label) {
          state.filters[filterIndex].value_label = [
            ...state.filters[filterIndex].value_label,
            action.payload.value_label,
          ];
        }
        state.selectedFilter = null;

        storeFilters(state.token, [...state.filters]);
      }
    },
    removeFilter: (state, action) => {
      const filterIndex = state.filters.findIndex((filter) => filter.id === action.payload.id);

      if (filterIndex !== -1) {
        state.filters[filterIndex] = {
          ...state.filters[filterIndex],
          applied: false,
          selected: false,
          value: [],
          value_label: [],
        };
        state.selectedFilter = null;

        storeFilters(state.token, [...state.filters]);
      }
    },
    setSelectedFilter: (state, action) => {
      state.selectedFilter = action.payload;
    },
    setRefresh: (state) => {
      state.refresh = !state.refresh;
    },
    resetToken: (state) => {
      state.token = "";
    },
  },
});

export const {
  setTable,
  setRowsPerPage,
  setPage,
  setLoading,
  setSelectedRows,
  setSelectedRow,
  setMultiActionsModal,
  setRowActionsModal,
  setColumns,
  setSort,
  setSelectedFilter,
  removeFilter,
  applyFilter,
  setRefresh,
  resetToken,
} = tableSlice.actions;

export default tableSlice.reducer;
