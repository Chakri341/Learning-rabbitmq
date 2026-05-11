const amqp = require("amqplib");

async function createChannel() {

  const connection = await amqp.connect(
    "amqp://localhost"
  );

  const channel = await connection.createChannel();

  return channel;

}

module.exports = createChannel;