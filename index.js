const express = require('express');
const bodyParser = require('body-parser');
const redis = require('redis');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const client = redis.createClient();

const subscriber = redis.createClient();

subscriber.on('message', (channel, message) => {
  console.log(`Received message: ${message} from channel: ${channel}`);
});

subscriber.subscribe('user_registered');

app.post('/register', (req, res) => {
  const { username } = req.body;

  client.publish('user_registered', username, (err) => {
    if (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ message: 'User registered successfully' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
