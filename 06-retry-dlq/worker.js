const amqp = require("amqplib");

async function startWorker() {

  const connection = await amqp.connect("amqp://localhost");

  const channel = await connection.createChannel();

  // DLQ
  await channel.assertQueue("payment_dlq", {
    durable: true
  });

  // Retry Queue
  await channel.assertQueue("retry_queue", {
    durable: true,

    arguments: {

      // After TTL expires,
      // send back to payment_queue
      "x-dead-letter-exchange": "",

      "x-dead-letter-routing-key":
        "payment_queue",

      // Wait 5 seconds
      "x-message-ttl": 5000
    }
  });

  // Main Queue
  await channel.assertQueue("payment_queue", {
    durable: true
  });

  console.log("Worker Waiting...");

  channel.consume("payment_queue", async (message) => {

    const data = JSON.parse(
      message.content.toString()
    );

    try {

      console.log("Processing Payment:", data);

      // Simulate failure
      throw new Error("Payment Failed");

    } catch (error) {

      console.log("Processing Failed");

      const retries =
        message.properties.headers?.["x-retries"] || 0;

      // Max retries
      if (retries >= 3) {

        console.log("Moving To DLQ");

        channel.sendToQueue(
          "payment_dlq",
          Buffer.from(
            JSON.stringify(data)
          ),
          {
            persistent: true
          }
        );

      } else {

        console.log(
          `Retry Attempt: ${retries + 1}`
        );

        channel.sendToQueue(
          "retry_queue",
          Buffer.from(
            JSON.stringify(data)
          ),
          {
            headers: {
              "x-retries": retries + 1
            }
          }
        );

      }

      // Remove original message
      channel.ack(message);

    }

  });

}

startWorker();