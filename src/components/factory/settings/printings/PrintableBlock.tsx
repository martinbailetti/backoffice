import React from "react";
import { QRCodeSVG } from 'qrcode.react';

// Componente imprimible con forwardRef
const PrintableBlock = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((_props, ref) => {
    return (
        <div
            ref={ref}
            className="printable-content"
        >

            <div className="printable-content-row ">
                <div className="data">
                    <div className="qr"><QRCodeSVG value="https://reactjs.org/" /></div>
                    <div className="info">
                        <div className="fw-bold">Type</div>
                        <div className="fw-bold">TypeInfo</div>
                        <div>Group:</div>
                        <div>00.00.00.00.00.00</div>
                        <div>Machine:</div>
                        <div>00.00.00.00.00.00</div>
                    </div>
                </div>
                <div className="data">
                    <div className="qr"><QRCodeSVG value="https://reactjs.org/" /></div>
                    <div className="info">
                        <div className="fw-bold">Type</div>
                        <div className="fw-bold">TypeInfo</div>
                        <div>Group:</div>
                        <div>00.00.00.00.00.00</div>
                        <div>Machine:</div>
                        <div>00.00.00.00.00.00</div>
                    </div>
                </div>

            </div>
            <div className="printable-content-row">
                <div className="data">
                    <div className="qr"><QRCodeSVG value="https://reactjs.org/" /></div>
                    <div className="info">
                        <div className="fw-bold">Type</div>
                        <div className="fw-bold">TypeInfo</div>
                        <div>Group:</div>
                        <div>00.00.00.00.00.00</div>
                        <div>Machine:</div>
                        <div>00.00.00.00.00.00</div>
                    </div>
                </div>
                <div className="data">
                    <div className="qr"><QRCodeSVG value="https://reactjs.org/" /></div>
                    <div className="info">
                        <div className="fw-bold">Type</div>
                        <div className="fw-bold">TypeInfo</div>
                        <div>Group:</div>
                        <div>00.00.00.00.00.00</div>
                        <div>Machine:</div>
                        <div>00.00.00.00.00.00</div>
                    </div>
                </div>

            </div>
        </div>
    );
});

PrintableBlock.displayName = "PrintableBlock";
export default PrintableBlock;