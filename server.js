const express = require('express');
const WebSocket = require('ws');

const app = express();
app.use(express.json())
const server = app.listen(3000, () => {
  console.log('Servidor Express iniciado na porta 3000');
});

const wss = new WebSocket.Server({ server });

const clients = [];

app.post('/dht11he', (req, res) => {
  const data = req.body;
  console.log(data)
  clients.forEach(client => {
    client.send(JSON.stringify(data));
  });
  res.send("Mensagem Enviada")
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

wss.on('connection', (ws) => {
  clients.push(ws);
  ws.on('message', (message) => {
    console.log('Mensagem recebida:', message);
  });
  ws.on('close', () => {
    clients.splice(clients.indexOf(ws), 1);
  });
});