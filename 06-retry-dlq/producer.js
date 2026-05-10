const amqp = require("amqplib");

async function sendMessage() {

  const connection = await amqp.connect("amqp://localhost");

  const channel = await connection.createChannel();

  const queue = "payment_queue";

  await channel.assertQueue(queue, {
    durable: true
  });

  const message = {
    paymentId: 101,
    amount: 500
  };

  channel.sendToQueue(
    queue,
    Buffer.from(JSON.stringify(message)),
    {
      persistent: true
    }
  );

  console.log("Payment Message Sent");

  setTimeout(() => {
    connection.close();
  }, 500);

}

sendMessage();