const amqp = require("amqplib");

async function emailService() {

  try {

    const connection = await amqp.connect("amqp://localhost");

    const channel = await connection.createChannel();

    const exchange = "notifications_exchange";

    // Create exchange
    await channel.assertExchange(
      exchange,
      "fanout"
    );

    // Create temporary queue
    const q = await channel.assertQueue("");

    // Bind queue to exchange
    channel.bindQueue(
      q.queue,
      exchange,
      ""
    );

    console.log("Email Service Waiting...");

    channel.consume(q.queue, (message) => {

      const data = JSON.parse(
        message.content.toString()
      );

      console.log("EMAIL SENT:", data);

    }, {
      noAck: true
    });

  } catch (error) {
    console.log(error);
  }

}

emailService();