import { useTranslation } from "@/context/contextUtils";
import React, { memo } from "react";

/**
 * Modal component.
 */

const ModalComponent = memo(
  ({
    onAction,
    onClose,
    closeButton,
    title,
    children,
    onActionLabel,
    centered = true,
    theme = "default",
    dismissible = false,
    overflowHidden = true,
  }: {
    title: string;
    closeButton?: boolean;
    onAction?: () => void;
    onActionLabel?: string;
    onClose?: () => void;
    children: React.ReactNode;
    position?: string;
    centered?: boolean;
    theme?: string;
    dismissible?: boolean;
    overflowHidden?: boolean;
  }) => {

    const t = useTranslation();
    return (

      <div
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        className={`z-3 mb-modal  fixed-top w-100 h-100 dvh-100 d-flex flex-column align-items-center ${centered ? 'justify-content-center' : ''}`}
        onClick={dismissible ? onClose : undefined}
      >
        <div className={`mb-modal-content max-width-md-900px rounded d-flex flex-column bg-white ${centered ? '' : 'mt-3'}`} onClick={(e) => e.stopPropagation()}>
          <div className={`d-flex p-3 justify-content-between align-items-center border-bottom ${theme == "error" ? "bg-danger text-light" : ""}`}>
            <h1 className="modal-title fs-5" id="modalLabel">
              {title}
            </h1>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className={`mb-modal-body p-3 ${overflowHidden?"overflow-hidden":""}`}>{children}</div>
          {(onActionLabel || closeButton) && <>
            <div className="mb-modal-footer p-3  border-top d-flex justify-content-end align-items-center">
              {onAction && onActionLabel && (
                <button type="button" className="btn btn-primary" onClick={onAction}>
                  {t(onActionLabel)}
                </button>
              )}

              {closeButton && (
                <button type="button" className="btn btn-secondary ms-1" onClick={onClose}>
                  {t("close")}
                </button>
              )}
            </div>
          </>}

        </div>
      </div>
    );
  },
);
ModalComponent.displayName = "ModalComponent";
export default ModalComponent;
