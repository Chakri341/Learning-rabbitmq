const createChannel = require("./shared/rabbitmq");

async function inventoryService() {

  const channel = await createChannel();

  const exchange = "orders_exchange";

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

  console.log("Inventory Service Waiting...");

  channel.consume(q.queue, (message) => {

    const data = JSON.parse(
      message.content.toString()
    );

    console.log(
      "Updating Inventory:",
      data
    );

  }, {
    noAck: true
  });

}

inventoryService();