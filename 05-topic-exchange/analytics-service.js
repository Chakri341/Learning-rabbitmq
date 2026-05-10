const amqp = require("amqplib");

async function analyticsService() {

  try {

    const connection = await amqp.connect("amqp://localhost");

    const channel = await connection.createChannel();

    const exchange = "topic_exchange";

    await channel.assertExchange(
      exchange,
      "topic"
    );

    const q = await channel.assertQueue("");

    // Listen to ALL events
    channel.bindQueue(
      q.queue,
      exchange,
      "#"
    );

    console.log("Analytics Service Waiting...");

    channel.consume(q.queue, (message) => {

      console.log(
        "ANALYTICS EVENT:",
        message.content.toString()
      );

    }, {
      noAck: true
    });

  } catch (error) {
    console.log(error);
  }

}

analyticsService();