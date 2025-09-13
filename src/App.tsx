import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import type { IDetectedBarcode } from "@yudiel/react-qr-scanner";

function App() {
  const [history, setHistory] = useState<string[]>([]);
  const [lastScan, setLastScan] = useState<string>("");
  const [showScanner, setShowScanner] = useState(false);

  const playBeep = () => {
    const audio = new Audio("/beep.mp3");
    audio.play().catch((err) => console.error("Beep sound error:", err));
  };

  const handleScan = (codes: IDetectedBarcode[]) => {
    if (codes.length > 0) {
      const value = codes[0].rawValue;
      if (value !== lastScan) {
        setLastScan(value);
        setHistory((prev) => [value, ...prev]);
        playBeep();
        setShowScanner(false); // tutup setelah scan
      }
    }
  };

  const handleError = (err: unknown) => {
    console.error("QR Scanner Error:", err);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-xl font-bold mb-4 text-blue-700">QR Scanner Demo 📷</h1>

      <button
        onClick={() => setShowScanner(true)}
        className="mb-4 w-full max-w-xs px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-lg font-medium"
      >
        Buka Scanner
      </button>

      {/* Full Screen Scanner */}
      {showScanner && (
        <div className="fixed inset-0 z-50 bg-black">
          {/* Tombol tutup floating */}
          <button
            onClick={() => setShowScanner(false)}
            className="absolute z-50 top-4 right-4 bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-red-700 transition"
          >
            ✕
          </button>

          {/* Scanner harus memenuhi layar */}
          <Scanner
            onScan={handleScan}
            onError={handleError}
            styles={{
              container: { width: "100%", height: "100%" },
              video: { width: "100%", height: "100%", objectFit: "cover" },
            }}
            constraints={{ facingMode: "environment" }}
          />

          {/* Overlay kotak hijau + garis scan */}
          {/* <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-3/4 h-1/3 border-4 border-green-500 rounded-lg">
              <div className="absolute inset-0 bg-green-500 opacity-10 rounded-lg"></div>
              <div className="absolute top-0 left-0 w-full h-0.5 bg-green-400 animate-scan"></div>
            </div>
          </div> */}
        </div>
      )}

      {/* History */}
      <div className="mt-4 p-4 w-full max-w-md bg-white rounded-lg shadow">
        <h2 className="font-semibold text-gray-700 mb-2 text-lg">History Scan</h2>
        {history.length === 0 ? (
          <p className="text-gray-500">Belum ada hasil</p>
        ) : (
          <ul className="space-y-2 max-h-56 overflow-y-auto">
            {history.map((item, idx) => (
              <li
                key={idx}
                className="p-3 border rounded bg-green-50 text-green-700 font-mono text-sm break-all"
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
