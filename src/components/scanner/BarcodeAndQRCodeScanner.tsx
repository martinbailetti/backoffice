import React, { useRef, useState, useEffect, useCallback } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import { MdSwitchVideo } from "react-icons/md";

interface BarcodeAndQRCodeScannerProps {
  setCode: (code: string) => void;
}

const BarcodeAndQRCodeScanner = ({ setCode }: BarcodeAndQRCodeScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceIndex, setSelectedDeviceIndex] = useState<number>(-1);
  const [scanning, setScanning] = useState<boolean>(false);

  const stopScanner = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.stop();
    }

    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop()); // Detiene todos los tracks (video/audio)
      videoRef.current.srcObject = null; // Limpia el srcObject del video
    }
    setScanning(false);
  }, []);

  const startScanner = useCallback(async () => {
    if (selectedDeviceIndex === -1) {
      console.error("No camera selected.");
      return;
    }
    const codeReader = new BrowserMultiFormatReader();

    try {
      await codeReader.decodeFromVideoDevice(
        devices[selectedDeviceIndex].deviceId,
        videoRef.current!,
        (result, err) => {
          if (result) {

            setCode(result.getText());
            //  stopScanner();
          }

          if (err) {
            console.warn("Error temporal:", err);
          }
        },
      );

      controlsRef.current = {
        stop: () => {
          codeReader.reset();
        },
      };

      setScanning(true);
    } catch (error) {
      console.error("Error starting scanner:", error);
    }
  }, [selectedDeviceIndex, devices, setCode]);

  useEffect(() => {
    if (selectedDeviceIndex >= 0) {

        startScanner();

    }
    return () => {
      stopScanner();
    };
  }, [selectedDeviceIndex, startScanner, stopScanner]);


  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    const listDevices = async () => {
      try {
        const videoInputDevices = await codeReader.listVideoInputDevices();
        setDevices(videoInputDevices);
        if (videoInputDevices.length > 0) {
          setSelectedDeviceIndex(0);
        }
      } catch (error) {
        console.error("Error listing video input devices:", error);
      }
    };

    listDevices();

    return () => {
      if (controlsRef.current) {
        controlsRef.current.stop();
      }
    };
  }, []);

  const handleCameraChange = () => {
    if (scanning) {
      stopScanner();
      if (selectedDeviceIndex == devices.length - 1) {
        setSelectedDeviceIndex(0);
      } else {
        setSelectedDeviceIndex(selectedDeviceIndex + 1);
      }
    }
  };
  return (
    <div className="h-100 position-relative">
      {selectedDeviceIndex >= 0 && (
        <>
          <video ref={videoRef} style={{ width: "100%" }} className="h-100 v-100" />
          <div className="position-absolute bottom-0 end-0">
            <button
              className="btn btn-secondary text-center fs-4 me-1 mb-1"
              onClick={handleCameraChange}
            >
              <div className="text-nowrap fs-very-small">
                {selectedDeviceIndex + 1} de {devices.length}
              </div>
              <MdSwitchVideo />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BarcodeAndQRCodeScanner;
