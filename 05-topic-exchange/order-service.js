const amqp = require("amqplib");

async function orderService() {

  try {

    const connection = await amqp.connect("amqp://localhost");

    const channel = await connection.createChannel();

    const exchange = "topic_exchange";

    await channel.assertExchange(
      exchange,
      "topic"
    );

    const q = await channel.assertQueue("");

    // Listen only to order events
    channel.bindQueue(
      q.queue,
      exchange,
      "order.*"
    );

    console.log("Order Service Waiting...");

    channel.consume(q.queue, (message) => {

      console.log(
        "ORDER EVENT:",
        message.content.toString()
      );

    }, {
      noAck: true
    });

  } catch (error) {
    console.log(error);
  }

}

orderService();