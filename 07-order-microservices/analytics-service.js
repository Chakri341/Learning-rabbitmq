const createChannel = require("./shared/rabbitmq");

async function analyticsService() {

  const channel = await createChannel();

  const exchange = "orders_exchange";

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
      "Analytics Event:",
      message.content.toString()
    );

  }, {
    noAck: true
  });

}

analyticsService();