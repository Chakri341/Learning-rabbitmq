const amqp = require("amqplib");

async function sendTask() {

  try {

    const connection = await amqp.connect("amqp://localhost");

    const channel = await connection.createChannel();

    const queue = "tasks_queue";

    await channel.assertQueue(queue);

    const task = process.argv[2] || "Simple Task";

    channel.sendToQueue(
      queue,
      Buffer.from(task)
    );

    console.log("Task Sent:", task);

    setTimeout(() => {
      connection.close();
    }, 500);

  } catch (error) {
    console.log(error);
  }

}

sendTask();