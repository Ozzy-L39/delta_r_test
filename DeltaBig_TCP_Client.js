const Net = require('net');

const port = 8888;
// const ip = '192.168.10.200';
const ip = '192.168.1.99'

const client = new Net.Socket();

client.connect({host: ip, port}, function(){
    console.log("TCP connection with server");

    client.write('Hello server from client')
});

client.on('data', function(chunk){
    console.log('Raw data:', chunk);
    console.log('Hex:', chunk.toString('hex'));
});

client.on('end', function(){
    console.log('Requested an end to the TCP Connection');
});

client.on('error', function(err){
    console.log(`Error - ${err}`)
});