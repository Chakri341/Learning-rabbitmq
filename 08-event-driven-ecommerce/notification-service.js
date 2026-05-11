const createChannel = require("./shared/rabbitmq");

async function notificationService() {

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
    "#"
  );

  console.log("Notification Service Waiting...");

  channel.consume(q.queue, (message) => {

    console.log(
      "NOTIFICATION EVENT:",
      message.fields.routingKey
    );

  }, {
    noAck: true
  });

}

notificationService();