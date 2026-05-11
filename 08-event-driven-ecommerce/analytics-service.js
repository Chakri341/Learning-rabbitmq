const createChannel = require("./shared/rabbitmq");

async function analyticsService() {

  const channel = await createChannel();

  const exchange = "ecommerce_exchange";

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

    const data = JSON.parse(
      message.content.toString()
    );

    const routingKey =
      message.fields.routingKey;

    console.log(`
ANALYTICS EVENT

Event: ${routingKey}
Data:
`, data);

  }, {
    noAck: true
  });

}

analyticsService();