
import { memo, ReactNode } from "react";
import Alert from "../alert/Alert";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setFlashMessage } from "@/slices/appSlice";

const FormWrapper = ({ children }: { children: ReactNode }) => {
  const appDataFlashMessage = useAppSelector((state) => state.appData.flashMessage);
  const dispatch = useAppDispatch();
  return (
    <div className="mt-2 px-2 px-md-0 overflow-x-hidden overflow-y-auto pb-5 flex-grow-1">
      {children}
      {appDataFlashMessage.message !== "" && (
        <Alert
          message={appDataFlashMessage.message}
          type={appDataFlashMessage.type}
          closeAlert={() => {
            dispatch(setFlashMessage({ message: "" }));
          }}
        />
      )}
    </div>
  );
};
export default memo(FormWrapper);
