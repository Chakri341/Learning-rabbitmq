const amqp = require("amqplib");

async function publishEvent() {

  try {

    const connection = await amqp.connect("amqp://localhost");

    const channel = await connection.createChannel();

    const exchange = "topic_exchange";

    // Create topic exchange
    await channel.assertExchange(
      exchange,
      "topic"
    );

    // Events
    const events = [
      {
        routingKey: "order.created",
        data: { orderId: 101 }
      },
      {
        routingKey: "payment.success",
        data: { paymentId: 501 }
      },
      {
        routingKey: "user.created",
        data: { userId: 99 }
      }
    ];

    // Publish all events
    events.forEach((event) => {

      channel.publish(
        exchange,
        event.routingKey,
        Buffer.from(
          JSON.stringify(event.data)
        )
      );

      console.log(
        `Event Published: ${event.routingKey}`
      );

    });

    setTimeout(() => {
      connection.close();
    }, 500);

  } catch (error) {
    console.log(error);
  }

}

publishEvent();