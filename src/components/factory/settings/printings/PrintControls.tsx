import { GenericRecord } from "@/types";
import React, { memo } from "react";

/**
 * Print controls component.
 */

const PrintControls = ({
    style,
    setStyle,
}: {
    style: GenericRecord;
    setStyle: (style: GenericRecord) => void;
}) => {



    return (
        <>

            <div className="d-flex align-items-center">
                <div className="w-100px">
                    Page
                </div>
                <div className="">
                    <label>Width</label>
                    <input type="number" className="form-control w-100px" step="0.01" min="0" defaultValue={style.pageWidth} onChange={(e) => setStyle({ ...style, pageWidth: Number(e.target.value) })} />
                </div>
                <div className="ps-1">
                    <label>Height</label>
                    <input type="number" className="form-control w-100px" step="0.01" min="0" defaultValue={style.pageHeight} onChange={(e) => setStyle({ ...style, pageHeight: Number(e.target.value) })} />
                </div>
            </div>

            <div className="d-flex align-items-center">
                <div className="w-100px pt-1">
                    QR
                </div>
                <div className="pt-1">
                    <label>Size</label>
                    <input type="number" className="form-control w-100px" step="0.01" min="0" defaultValue={style.qrSize} onChange={(e) => setStyle({ ...style, qrSize: Number(e.target.value) })} />
                </div>
                <div className="pt-1 ps-1">
                    <label>MarginLeft</label>
                    <input type="number" className="form-control w-100px" step="0.01" min="0" defaultValue={style.qrMarginLeft} onChange={(e) => setStyle({ ...style, qrMarginLeft: Number(e.target.value) })} />
                </div>
                <div className="pt-1 ps-1">
                    <label>MarginRight</label>
                    <input type="number" className="form-control w-100px" step="0.01" min="0" defaultValue={style.qrMarginRight} onChange={(e) => setStyle({ ...style, qrMarginRight: Number(e.target.value) })} />
                </div>
                <div className="pt-1 ps-1">
                    <label>MarginTop</label>
                    <input type="number" className="form-control w-100px" step="0.01" min="0" defaultValue={style.qrMarginTop} onChange={(e) => setStyle({ ...style, qrMarginTop: Number(e.target.value) })} />
                </div>
            </div>
            <div className="d-flex align-items-center">
                <div className="w-100px">
                    Font
                </div>
                <div className="pt-1">
                    <label>Size</label>
                    <input type="number" className="form-control w-100px" step="0.01" min="0" defaultValue={style.fontSize} onChange={(e) => setStyle({ ...style, fontSize: Number(e.target.value) })} />
                </div>
                <div className=" pt-1 ps-1">
                    <label>LineHeight</label>
                    <input type="number" className="form-control w-100px" step="0.01" min="0" defaultValue={style.lineHeight} onChange={(e) => setStyle({ ...style, lineHeight: Number(e.target.value) })} />
                </div>
            </div>
            <div className="d-flex align-items-center">
                <div className="w-100px">
                    Info
                </div>
                <div className="pt-1">
                    <label>Width</label>
                    <input type="number" className="form-control w-100px" step="0.01" min="0" defaultValue={style.infoWidth} onChange={(e) => setStyle({ ...style, infoWidth: Number(e.target.value) })} />
                </div>
                <div className="pt-1 ps-1">
                    <label>MarginTop</label>
                    <input type="number" className="form-control w-100px" step="0.01" min="0" defaultValue={style.infoMarginTop} onChange={(e) => setStyle({ ...style, infoMarginTop: Number(e.target.value) })} />
                </div>
            </div>

        </>
    );
};
export default memo(PrintControls);
