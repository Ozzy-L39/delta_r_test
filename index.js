import { SerialPort } from "serialport";

const BAUD_RATE = 115200;
const TARGET_PATH = "COM9"; // change if needed
const SCAN_INTERVAL_MS = 2000;

let port = null;
let isOpening = false;

async function findPort() {
  try {
    const ports = await SerialPort.list();
    return ports.find(p => p.path === TARGET_PATH);
  } catch (err) {
    console.error("Port scan error:", err.message);
    return null;
  }
}

async function openPort() {
  if (port?.isOpen || isOpening) return;

  isOpening = true;

  const portInfo = await findPort();
  if (!portInfo) {
    isOpening = false;
    return;
  }

  console.log(`Device found on ${TARGET_PATH}, opening...`);

  port = new SerialPort({
    path: TARGET_PATH,
    baudRate: BAUD_RATE,
    dataBits: 8,
    stopBits: 1,
    parity: "none",
    autoOpen: false,
  });

  port.open(err => {
    isOpening = false;

    if (err) {
      console.error("Open error:", err.message);
      return;
    }

    console.log("Serial port opened");

  });

  port.on("data", data => {
    // Print raw data immediately
    process.stdout.write(data.toString("utf8"));
  });

  port.on("error", err => {
    console.error("Serial error:", err.message);
  });

  port.on("close", () => {
    console.warn("Serial port closed, waiting for reconnect...");
    port = null;
  });
}

// Scan loop (never exits)
setInterval(openPort, SCAN_INTERVAL_MS);

// Initial message
console.log("Listening for serial device...");


// import { SerialPort } from "serialport";

// // const ports = await SerialPort.list();

// // ports.forEach(p => {
// //     console.log({
// //         path: p.path,
// //         manufacturer: p.manufacturer,
// //         vendorId: p.vendorId,
// //         productId: p.productId,
// //     });
// // });

// const port = new SerialPort({
//     path: 'COM5', 
//     baudRate: 115200,
//     dataBits: 8,
//     stopBits: 1,
//     parity: "none",
//     autoOpen: false,
// });

// port.open(err => {
//     if(err){
//         console.log('Open Error:', err.message);
//         return;
//     }
//     console.log("Serial Port Opened");
// });


// let bufferCache = '';

// port.on('data', data => {
//     // console.log(data);
//     // Convert incoming buffer to string
//     bufferCache += data.toString('utf8');
//     console.log(data.toString('utf8'))

//     // Check if we have a complete JSON message (ends with })
//     // while (bufferCache.includes('}')) {
//     //     // Find the first closing brace
//     //     const endIndex = bufferCache.indexOf('}') + 1;

//     //     // Extract the full JSON string
//     //     const jsonString = bufferCache.slice(0, endIndex);

//     //     // Remove it from the cache
//     //     bufferCache = bufferCache.slice(endIndex);

//     //     // Try parsing
//     //     try {
//     //         const obj = JSON.parse(jsonString);
//     //         console.log('Full JSON object:\n', JSON.stringify(obj, null, 2));
//     //     } catch (err) {
//     //         // Partial JSON, put it back in the cache
//     //         bufferCache = jsonString + bufferCache;
//     //         break;
//     //     }
//     // }
// });