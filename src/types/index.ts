import { FormEvent } from "react";

export interface UserInterface {
  name: string;
  email?: string;
  created_at?: string;
}
export interface LoginFormProps {
  submitLogin: (event: FormEvent) => Promise<void>;
  message: string;
  setForm: (value: string) => void;
}

export interface SignUpFormProps {
  submitSignUp: (event: FormEvent) => Promise<void>;
  message: string;
  setForm: (value: string) => void;
}
export interface ForgotPasswordFormProps {
  submitRestorePassword: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  message: string;
  setForm: (value: string) => void;
}
export interface ForgotPasswordFormSuccessProps {
  setForm: (value: string) => void;
}

export interface SignUpFormSuccessSuccessProps {
  setForm: (value: string) => void;
}

export interface ModalMessageProps {
  message: string;
  closeModal: (event: React.MouseEvent<HTMLDivElement>) => void;
}
export interface ServerErrorInterface {
  response: {
    data: {
      error: string;
    };
  };
}

// NEW CODE

export type GenericRecord = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

export type GenericRecordValueType = GenericRecord | null | string | number | GenericRecord[] | number[] | string[];

export interface Planet {
  id: number;
  name: string;
  planet_category: {
    name: string;
  };
  color: string;
  orbital_period: number;
}
export interface TableProps {
  metaColumns?: GenericRecord[];
  customStyles?: GenericRecord | null;
  setTotal?: (total: number) => void;
  fixedHeight?: boolean;
  customMultiActions?: GenericRecord[];
}

export type DataTableFetch = (params: {
  per_page: number;
  page: number;
  filters: GenericRecord[];
  sort_by: string | null;
  sort_direction: "asc" | "desc" | null;
}) => Promise<{
  data: {
    success: boolean;
    message: string;
    result: {
      data: GenericRecord[];
      total: number;
    };
  };
}>;
