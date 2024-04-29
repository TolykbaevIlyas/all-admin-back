const WebSockets = require('ws');

// Создаем новый WebSocket сервер на порту 8080
const wss = new WebSockets.Server({ port: 8080 });

// Обработчик подключений клиентов
wss.on('connection', function connection(ws) {
  console.log('Новое соединение установлено');

  // Обработчик сообщений от клиента
  ws.on('message', function incoming(message) {
    console.log('Получено сообщение от клиента:', message);

    // Отправляем ответ клиенту
    ws.send('Получено сообщение: ' + message);
  });
});
