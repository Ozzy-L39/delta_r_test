const dgram = require('dgram');
const server = dgram.createSocket("udp4");
// const server = dgram.createSocket({type:"udp4",reuseAddr:true});

const clients = new Map();

server.on('message', (msg, rinfo) => {
    const clientKey = `${rinfo.address}:${rinfo.port}`;

    if(!clients.has(clientKey)){
        clients.set(clientKey, rinfo);
        console.log(`Registered client ${clientKey}`);
    }

    console.log(`Received message: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
    const address = server.address();
    console.log(`Server Listening on ${address.address}:${address.port}`)
});

server.on('close',function(){
    console.log('Socket is closed !');
});

server.bind(9999, '0.0.0.0');


setInterval(() => {
    const payload = JSON.stringify({
        "ID": 6,
        "Freq": "2426MHz",
        "Band": "9MHz",
        "Level": "0dbm",
        "Angle": 60.0,
        "Distance": "1000m",
        "Model": "DJPhantom4",
        "UAVID": "6",
        "UAVLat": 30.345678,
        "UAVLong": 103.987654,
        "CtrlLat": 30.345678,
        "CtrlLong": 103.987654,
        "Height": 120.0
    });

    for (const [key, client] of clients){
        server.send(
            payload,
            client.port,
            client.address,
            (err) => {
                if(err){
                    console.error(`Failed to send to ${key}`, err);
                }
            }
        )
    }

    if(clients.size > 0){
        console.log(`Sent update`);
    }
}, 1000);



// const dgram = require('dgram');
// const server = dgram.createSocket('udp4');

// server.on('listening', () => {
//     const a = server.address();
//     console.log(`SERVER listening on ${a.address}:${a.port}`);
// });

// server.on('message', (msg, rinfo) => {
//     console.log(`SERVER got "${msg}" from ${rinfo.address}:${rinfo.port}`);

//     server.send(
//         'pong',
//         rinfo.port,
//         rinfo.address,
//         err => err && console.error(err)
//     );
// });

// server.bind(9999);
