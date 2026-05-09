const amqp = require("amqplib");

async function pushService() {

  try {

    const connection = await amqp.connect("amqp://localhost");

    const channel = await connection.createChannel();

    const exchange = "notifications_exchange";

    await channel.assertExchange(
      exchange,
      "fanout"
    );

    const q = await channel.assertQueue("");

    channel.bindQueue(
      q.queue,
      exchange,
      ""
    );

    console.log("Push Service Waiting...");

    channel.consume(q.queue, (message) => {

      const data = JSON.parse(
        message.content.toString()
      );

      console.log("PUSH SENT:", data);

    }, {
      noAck: true
    });

  } catch (error) {
    console.log(error);
  }

}

pushService();