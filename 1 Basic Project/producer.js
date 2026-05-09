const amqp = require("amqplib");

async function sendMessage() {

  // STEP 1: Create connection
  const connection = await amqp.connect("amqp://localhost");

  // STEP 2: Create channel
  const channel = await connection.createChannel();

  // STEP 3: Queue name
  const queue = "hello";

  // STEP 4: Ensure queue exists
  await channel.assertQueue(queue);

  // STEP 5: Message
  const message ="Hello RabbitMQQQ";
  

  // STEP 6: Send message
  channel.sendToQueue(
    queue,
    Buffer.from(message)
  );

  console.log("Message Sent:", message);

  // STEP 7: Close connection
  setTimeout(() => {
    connection.close();
  }, 500);

}

sendMessage();