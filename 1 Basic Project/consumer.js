const amqp = require("amqplib");

async function receiveMessage() {

  // STEP 1: Connect
  const connection = await amqp.connect("amqp://localhost");

  // STEP 2: Create channel
  const channel = await connection.createChannel();

  // STEP 3: Queue name
  const queue = "hello";

  // STEP 4: Ensure queue exists
  await channel.assertQueue(queue);

  console.log("Waiting for messages...");

  // STEP 5: Consume messages
  channel.consume(queue, (message) => {

    console.log(
      "Received:",
      message.content.toString()
    );

  });

}

receiveMessage();