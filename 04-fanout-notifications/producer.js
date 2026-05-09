const amqp = require("amqplib");

async function publishNotification() {

  try {

    const connection = await amqp.connect("amqp://localhost");

    const channel = await connection.createChannel();

    const exchange = "notifications_exchange";

    // Create fanout exchange
    await channel.assertExchange(
      exchange,
      "fanout"
    );

    const message = {
      event: "ORDER_CREATED",
      orderId: 101
    };

    // Publish message to exchange
    channel.publish(
      exchange,
      "",
      Buffer.from(JSON.stringify(message))
    );

    console.log("Notification Published");

    setTimeout(() => {
      connection.close();
    }, 500);

  } catch (error) {
    console.log(error);
  }

}

publishNotification();