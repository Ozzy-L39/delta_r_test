import { SerialPort } from "serialport";

// const ports = await SerialPort.list();

// ports.forEach(p => {
//     console.log({
//         path: p.path,
//         manufacturer: p.manufacturer,
//         vendorId: p.vendorId,
//         productId: p.productId,
//     });
// });

const port = new SerialPort({
    path: 'COM5', 
    baudRate: 115200,
    dataBits: 8,
    stopBits: 1,
    parity: "none",
    autoOpen: false,
});

port.open(err => {
    if(err){
        console.log('Open Error:', err.message);
        return;
    }
    console.log("Serial Port Opened");
});

port.on('data', data => {
    console.log('Raw:', data);
    console.log(data.toString('utf8'));
});