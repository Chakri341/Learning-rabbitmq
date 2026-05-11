const createChannel = require("./shared/rabbitmq");

async function shippingService() {

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
    "inventory.updated"
  );

  console.log("Shipping Service Waiting...");

  channel.consume(q.queue, (message) => {

    const data = JSON.parse(
      message.content.toString()
    );

    console.log("Shipment Created:", data);

    channel.publish(
      exchange,
      "shipment.created",
      Buffer.from(JSON.stringify(data))
    );

    console.log("shipment.created published");

  }, {
    noAck: true
  });

}

shippingService();