const amqp = require("amqplib");

async function paymentService() {

  try {

    const connection = await amqp.connect("amqp://localhost");

    const channel = await connection.createChannel();

    const exchange = "topic_exchange";

    await channel.assertExchange(
      exchange,
      "topic"
    );

    const q = await channel.assertQueue("");

    // Listen only to payment events
    channel.bindQueue(
      q.queue,
      exchange,
      "payment.*"
    );

    console.log("Payment Service Waiting...");

    channel.consume(q.queue, (message) => {

      console.log(
        "PAYMENT EVENT:",
        message.content.toString()
      );

    }, {
      noAck: true
    });

  } catch (error) {
    console.log(error);
  }

}

paymentService();