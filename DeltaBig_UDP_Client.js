// const dgram = require('dgram');
// const client = dgram.createSocket({type:"udp4",reuseAddr:true});

// const port = 9999;
// const ip = '127.0.0.1';

// client.on('error', (err) => {
//     console.error(`Server Error: ${err}`);
// });

// client.on('message', (msg, rinfo) => {
//     console.log(`Received Message: ${msg}`);
// });

// client.on('listening', () => {
//     // const address = client.address();
//     console.log(`Server listening on ${ip}:${port}`);

//     client.send("Hello", port, ip);
// });

// client.on('close', ()=>{
//     console.log("Connection closed.")
// })

// client.bind(41234)

const dgram = require('dgram');
const client = dgram.createSocket('udp4');

client.on('listening', () => {
    const a = client.address();
    console.log(`CLIENT listening on ${a.address}:${a.port}`);

    client.send(
        'ping',
        9999,
        '192.168.1.98',
        err => err && console.error(err)
    );
});

client.on('message', msg => {
    console.log('CLIENT got:', msg.toString());
});

client.bind(41234);

