const createChannel = require("./shared/rabbitmq");

async function fraudService() {

  const channel = await createChannel();

  const exchange = "ecommerce_exchange";

  await channel.assertExchange(
    exchange,
    "topic"
  );

  const q = await channel.assertQueue("");

  // Listen to payment and order events
  channel.bindQueue(
    q.queue,
    exchange,
    "payment.*"
  );

  channel.bindQueue(
    q.queue,
    exchange,
    "order.*"
  );

  console.log("Fraud Service Waiting...");

  channel.consume(q.queue, (message) => {

    const data = JSON.parse(
      message.content.toString()
    );

    const routingKey =
      message.fields.routingKey;

    console.log(`
FRAUD CHECK

Event: ${routingKey}
Data:
`, data);

    // Example fraud check
    if (data.amount > 50000) {

      console.log(
        "⚠️ High Amount Transaction Detected"
      );

    }

  }, {
    noAck: true
  });

}

fraudService();