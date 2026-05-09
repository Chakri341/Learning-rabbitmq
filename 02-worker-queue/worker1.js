const amqp = require("amqplib");

async function startWorker() {

  try {

    const connection = await amqp.connect("amqp://localhost");

    const channel = await connection.createChannel();

    const queue = "tasks_queue";

    await channel.assertQueue(queue);

    console.log("Worker 1 Waiting for tasks...");

    channel.consume(queue, async (message) => {

      const task = message.content.toString();

      console.log("Worker 1 Processing:", task);

      // Simulate long task
      await new Promise((resolve) =>
        setTimeout(resolve, 3000)
      );

      console.log("Worker 1 Completed:", task);

    });

  } catch (error) {
    console.log(error);
  }

}

startWorker();