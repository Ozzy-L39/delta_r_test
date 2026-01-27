const Net = require('net');

const port = 8888;
const ip = '127.0.0.1';

const client = new Net.Socket();

client.connect({ip, port}, function(){
    console.log("TCP connection with server");

    client.write('Hello server from client')
});

client.on('data', function(chunk){
    console.log(`Data from Server: ${chunk.toString()}`);
});

client.on('end', function(){
    console.log('Requested an end to the TCP Connection');
});

client.on('error', function(err){
    console.log(`Error - ${err}`)
});