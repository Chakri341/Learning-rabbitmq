const createChannel = require("./shared/rabbitmq");

async function paymentService() {

  const channel = await createChannel();

  const exchange = "ecommerce_exchange";

  await channel.assertExchange(
    exchange,
    "topic"
  );

  const q = await channel.assertQueue("");

  channel.bindQueue(
    q.queue,
    exchange,
    "order.created"
  );

  console.log("Payment Service Waiting...");

  channel.consume(q.queue, (message) => {

    const data = JSON.parse(
      message.content.toString()
    );

    console.log("Payment Processing:", data);

    // Publish next event
    channel.publish(
      exchange,
      "payment.success",
      Buffer.from(JSON.stringify(data))
    );

    console.log("payment.success published");

  }, {
    noAck: true
  });

}

paymentService();