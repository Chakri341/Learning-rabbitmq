const amqp = require("amqplib");

const sendEmail = require("./fake-email-service");

async function startWorker() {

  try {

    const connection = await amqp.connect("amqp://localhost");

    const channel = await connection.createChannel();

    const queue = "email_queue";

    await channel.assertQueue(queue, {
      durable: true
    });

    // IMPORTANT
    channel.prefetch(1);

    console.log("Email Worker Waiting...");

    channel.consume(queue, async (message) => {

      const data = JSON.parse(
        message.content.toString()
      );

      console.log("Processing Email Job...");

      await sendEmail(
        data.email,
        data.subject
      );

      console.log("Email Job Completed");

      // ACKNOWLEDGE
      channel.ack(message);

    }, {
      noAck: false
    });

  } catch (error) {
    console.log(error);
  }

}

startWorker();