#!/usr/bin/env node

const net = require('net');
const dgram = require('dgram');

const { exec } = require('child_process');
const client = new net.Socket();
const udpClient = dgram.createSocket('udp4');
const http = require('http');
// const IP = '127.0.0.1';

// if if first two arduments are -l and -p then fire fundtion connect()
if (process.argv[2] === '-l' ) {
    let portNumber = process.argv[4];
    let IP = process.argv[3] || '127.0.0.1';
    let message = process.argv[5];
    if(portNumber){
        connect(portNumber, IP);
        if(message){
            client.write(message);
        }
    }else{
        console.log('Please provide a port number => ', process.argv[4]);
    }
}

if (process.argv[2] === '-l' && process.argv[4] === '-u') {
    let portNumber = process.argv[5];
    let IP = process.argv[3] ||  '127.0.0.1';
    let message = process.argv[6];
    if(portNumber){
        connectOverUDP(portNumber, IP, message);
    }else{
        console.log('Please provide a port number => ', process.argv[4]);
    }
}

// argv[2] is -z argv IP on argv[3] and port on argv[4] is array of ports
if (process.argv[2] === '-z') {
    let IP = process.argv[3] ||  '127.0.0.1';
    let portArray = process.argv[4].split(',');
    portArray.forEach(port => {
        connect(port, IP);
    });
}

// argv[2] is -message argv IP on argv[3] and port on argv[4] is portNumber and message on argv[5]
if (process.argv[2] === '-message' ) {
    let IP = process.argv[3] || '127.0.0.1';
    let portNumber = process.argv[4];
    let message = process.argv[5];
    if(portNumber){
        connect(portNumber, IP);
        if(message){
            client.write(message);
        }
    }
}



function connect(portNumber, IP){
    try{
        // let ipAddress = IP || `0.0.0.0`;
        let ipAddress = 'localhost'
        client.connect(portNumber, ipAddress, () => {
            console.log('Listening to server at', `${ipAddress}:${portNumber}`);
        });

        client.on('data', (data) => {
            console.log('Received: ', data.toString());
        });

        client.on('close', () => {
            console.log('Connection closed - bye!');
        });

        client.on('error', (err) => {
            console.log('Error: ', err);
        });
    }catch(err){
        console.log('err in connect() -->\n', err);
    }
}

function connectOverUDP(portNumber, IP, message){
    try{
        let messageData = message || "Hello World!"
        let data = Buffer.from(`${messageData}`);

        udpClient.send(data , portNumber, IP, function(error){
            if(error){
              udpClient.close();
            }else{
              console.log('Data sent ✌️');
            }
          });

    }catch(err){
        console.log('err in connectOverUDP() -->\n', err);
    }
}


process.on('SIGINT', () => {
    console.log('Received SIGINT. Closing application...');

    client.end(); // Close the connection
    udpClient.close(); // Close the connection

    // Perform cleanup tasks here if needed
    process.exit(0); // Exit the process
  });