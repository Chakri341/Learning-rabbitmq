const createChannel = require("./shared/rabbitmq");

async function createOrder() {

  const channel = await createChannel();

  const exchange = "ecommerce_exchange";

  await channel.assertExchange(
    exchange,
    "topic"
  );

  const order = {
    orderId: 101,
    product: "Laptop",
    amount: 70000
  };

  channel.publish(
    exchange,
    "order.created",
    Buffer.from(JSON.stringify(order))
  );

  console.log("order.created published");

}

createOrder();