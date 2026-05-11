const createChannel = require("./shared/rabbitmq");

async function createOrder() {

  const channel = await createChannel();

  const exchange = "orders_exchange";

  await channel.assertExchange(
    exchange,
    "topic"
  );

  const order = {
    orderId: 101,
    product: "iPhone",
    amount: 80000
  };

  channel.publish(
    exchange,
    "order.created",
    Buffer.from(JSON.stringify(order))
  );

  console.log("Order Created Event Published");

}

createOrder();