const Net = require('net');

const PORT  = 8888;

const server = Net.createServer();

server.on('connection', function(sock){
    console.log("CONNECTED: " + sock.remoteAddress + ":" + sock.remotePort);
    sock.on('data', function(data){
        console.log("DATA " + sock.remoteAddress + ":" + data);
        sock.write('Hello Client from server');
    });

    sock.on('end', function(){
        console.log('CONNECTION CLOSED: ' + sock.remoteAddress + ':' + sock.remotePort);
    });

    sock.on('error', function(err){
        console.log(`Error ${sock.remoteAddress}: ${err}`);
    });
});

server.listen(PORT, () => {
    console.log('TCP server is running on port' + PORT);
});
