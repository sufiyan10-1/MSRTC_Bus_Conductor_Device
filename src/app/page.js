'use client'

import { useEffect, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useRouter,usePathname } from 'next/navigation';
 

const ScanPage = () => {
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [manualId, setManualId] = useState('');
  const [error, setError] = useState(null);
  const [backCameraId, setBackCameraId] = useState(null);
  const [html5QrCode, setHtml5QrCode] = useState(null);
  const router = useRouter()
 

 


  useEffect(() => {
    Html5Qrcode.getCameras().then((cameras) => {
      if (cameras && cameras.length > 0) {
        const backCam = cameras.find((cam) => cam.label.toLowerCase().includes('back')) || cameras[cameras.length - 1];
        setBackCameraId(backCam.id);
      } else {
        setError('No cameras found');
      }
    }).catch(err => {
      setError('Camera access failed.');
      console.error(err);
    });
  }, []);

  useEffect(() => {
    if (isScanning && backCameraId) {
      const qrCode = new Html5Qrcode("reader");
      setHtml5QrCode(qrCode);

      qrCode.start(
        backCameraId,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        handleScanSuccess,
        handleScanError
      ).catch(err => {
        setError('Failed to start scanning');
        console.error(err);
      });

      return () => {
        qrCode.stop().catch(err => {
          console.error('Failed to stop scanning.', err);
        });
      };
    }
  }, [backCameraId, isScanning]);

  const handleScanSuccess = (decodedText) => {
    if (isValidId(decodedText)) {
      setScanResult(decodedText);
      setIsScanning(false);
      setShowInput(false);
    } else {
      setError('Scanned QR code does not meet the 10-digit requirement.');
    }
  };

  const handleScanError = (err) => {
    setError('Scanning failed. Please try again.');
  };

  const handleManualSubmit = () => {
    if (isValidId(manualId)) {
      setScanResult(manualId);
      setShowInput(false);
      setIsScanning(false);
    } else {
      setError('Entered ID does not meet the 10-digit requirement.');
    }
  };

  const stopScanning = () => {
    if (html5QrCode) {
      html5QrCode.stop().then(() => {
        setIsScanning(false);
        setShowInput(false);
      }).catch(err => {
        console.error('Failed to stop scanning.', err);
      });
    }
  };

  const isValidId = (id) => {
    return /^[\d-]{1,13}$/.test(id);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-semibold mb-8 text-gray-800">
        QR Code Scanner
      </h1>

      <div className="flex space-x-4 mb-8">
        <button
          className="px-5 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors"
          onClick={() => {
            setIsScanning(true);
            setShowInput(false);
          }}
        >
          Scan QR Code
        </button>
        <button
          className="px-5 py-3 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 transition-colors"
          onClick={() => {
            setShowInput(true);
            setIsScanning(false);
          }}
        >
          Enter ID Manually
        </button>
        {isScanning && (
          <button
            className="px-5 py-3 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-colors"
            onClick={stopScanning}
          >
            Stop Scanning
          </button>
        )}
      </div>

      {isScanning && (
        <div
          id="reader"
          className="relative w-full max-w-md bg-white p-4 rounded-lg shadow-md border border-gray-200"
        >
          {isScanning && !scanResult && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      )}

      {showInput && (
        <div className="mt-6 flex flex-col items-center">
          <input
            type="text"
            value={manualId}
            onChange={(e) => setManualId(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg w-80 max-w-xs"
            placeholder="Enter ID"
          />
          <button
            className="mt-4 px-5 py-2 bg-black text-white rounded-lg shadow-md hover:bg-gray-800 transition-colors"
            onClick={handleManualSubmit}
          >
            Submit
          </button>
        </div>
      )}

      <div className="mt-6 text-center">
        {scanResult ? (
          <div className="text-green-600 font-semibold text-lg">
            <p>Studnet Id:</p>
            <button
            onClick={(e)=>{e.preventDefault(); router.push(`/checking-pass/${scanResult}`)}}
            className="bg-white p-4 rounded-lg shadow-md border border-gray-200">{scanResult}</button>
          </div>
        ) : (
          <div className="text-red-600 font-semibold text-lg">
            {error || 'Ready to scan or enter ID'}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanPage;
