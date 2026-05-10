const amqp = require("amqplib");

async function startDLQWorker() {

  const connection = await amqp.connect("amqp://localhost");

  const channel = await connection.createChannel();

  await channel.assertQueue("payment_dlq", {
    durable: true
  });

  console.log("DLQ Worker Waiting...");

  channel.consume("payment_dlq", (message) => {

    const data = JSON.parse(
      message.content.toString()
    );

    console.log("DLQ MESSAGE:", data);

    channel.ack(message);

  });

}

startDLQWorker();