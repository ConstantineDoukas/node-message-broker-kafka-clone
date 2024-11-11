# Simple Kafka Clone in Node.js

This project implements a simplified clone of Apache Kafka in Node.js, designed to illustrate the core functionalities of a message broker. By building a basic version of Kafka, I explored fundamental concepts like message production, consumption, and topic management, gaining a deeper understanding of how these systems work.

## Why build a Kafka clone?

At Bank of America, we utilized Apache Kafka to build a real-time payment processing system, handling millions of transactions per day.  However, diving straight into the source code of Kafka can be daunting due to its complexity.

This project simplifies those complexities, providing a more accessible entry point for understanding the underlying principles of message brokers. By building a basic clone, I was able to:

*   **Gain a deeper understanding of Kafka's architecture:**  This involved implementing key components like topics, producers, and consumers, and understanding how they interact.
*   **Experiment with different design choices:**  Building a simplified version allowed me to explore various approaches to message handling and storage.
*   **Develop a foundation for further exploration:** This project serves as a stepping stone for delving into more advanced concepts like partitioning, replication, and fault tolerance.

## Features

*   Topic creation: Create new topics to store messages.
*   Message production: Produce messages to specified topics.
*   Message consumption: Consume messages from topics starting at a given offset.

## Limitations

*   Single broker: This implementation only supports a single broker instance.
*   In-memory storage: Messages are stored in memory and will be lost if the broker restarts.
*   Simplified protocol: The communication protocol is basic and doesn't handle complex scenarios or error handling.

## Usage

1.  Start the broker:
    ```bash
    node broker.js
    ```

2.  Produce messages (using `nc`):
    ```bash
    echo "Test message" | nc localhost 9092
    8 my-topic 0 
    ```

3.  Consume messages (using `nc`):
    ```bash
    nc localhost 9092
    8 my-topic 0
    ```

**Example (programmatic production):**

```javascript
const net = require('net');

const client = new net.Socket();
client.connect(9092, 'localhost', () => {
  const message = "Hello from Node.js client!";
  const topicName = "my-topic";
  const offset = 0;
  const data = `${topicName.length} ${topicName} ${offset}\n${message}`;
  client.write(data);
  client.destroy();
});