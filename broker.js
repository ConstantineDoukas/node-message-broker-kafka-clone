const net = require('net');

// Message class
class Message {
  constructor(offset, value) {
    this.offset = offset;
    this.value = value;
  }
}

// Topic class
class Topic {
  constructor(name) {
    this.name = name;
    this.log = [];
  }

  produce(value) {
    const offset = this.log.length;
    const message = new Message(offset, value);
    this.log.push(message);
    console.log(`Produced message to topic ${this.name}, offset ${offset}`);
  }

  consume(offset) {
    if (offset >= this.log.length) {
      return []; // No new messages
    }
    return this.log.slice(offset);
  }
}

// Broker class
class Broker {
  constructor() {
    this.topics = {};
  }

  createTopic(topicName) {
    this.topics[topicName] = new Topic(topicName);
  }

  produce(topicName, value) {
    const topic = this.topics[topicName];
    if (!topic) {
      console.log(`Topic ${topicName} not found`);
      return;
    }
    topic.produce(value);
  }

  consume(topicName, offset) {
    const topic = this.topics[topicName];
    if (!topic) {
      console.log(`Topic ${topicName} not found`);
      return [];
    }
    return topic.consume(offset);
  }
}

// Create a new broker
const broker = new Broker();

// Create a topic
broker.createTopic('my-topic');

// Start listening for connections
const server = net.createServer((socket) => {
  console.log('Client connected');

  socket.on('data', (data) => {
    // Convert the buffer to a string and split it
    const [topicNameLen, topicName, offset] = data.toString().trim().split(' ');

    // Validate topic name length (ensure it's a number and greater than 0)
    if (isNaN(topicNameLen) || topicNameLen <= 0) {
      console.error("Invalid topic name length");
      return;
    }

    // Determine if this is a producer or consumer (using stdin for producer)
    if (socket._handle.fd === process.stdin.fd) {
      // Read message from stdin (assuming it's already buffered)
      const message = data.slice(4 + parseInt(topicNameLen, 10) + 8).toString(); // Adjust offset based on the actual length
      broker.produce(topicName, message);
    } else {
      console.log("Received consume request for:", topicName, offset);
      const messages = broker.consume(topicName, Number(offset));
      for (const msg of messages) {
        socket.write(msg.value);
      }
    }
  });

  socket.on('end', () => {
    console.log('Client disconnected');
  });
});

server.listen(9092, () => {
  console.log('Broker started on :9092');
});