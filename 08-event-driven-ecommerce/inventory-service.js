const createChannel = require("./shared/rabbitmq");

async function inventoryService() {

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
    "payment.success"
  );

  console.log("Inventory Service Waiting...");

  channel.consume(q.queue, (message) => {

    const data = JSON.parse(
      message.content.toString()
    );

    console.log("Inventory Updated:", data);

    // Publish next event
    channel.publish(
      exchange,
      "inventory.updated",
      Buffer.from(JSON.stringify(data))
    );

    console.log("inventory.updated published");

  }, {
    noAck: true
  });

}

inventoryService();