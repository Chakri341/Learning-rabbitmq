const amqp = require("amqplib");

async function signupUser() {

  try {

    const connection = await amqp.connect("amqp://localhost");

    const channel = await connection.createChannel();

    const queue = "email_queue";

    // Durable queue
    await channel.assertQueue(queue, {
      durable: true
    });

    // Fake user data
    const user = {
      email: "user@gmail.com",
      subject: "Welcome to Our App"
    };

    // Send message
    channel.sendToQueue(
      queue,
      Buffer.from(JSON.stringify(user)),
      {
        persistent: true
      }
    );

    console.log("User Signup Successful");
    console.log("Email Job Added To Queue");

    setTimeout(() => {
      connection.close();
    }, 500);

  } catch (error) {
    console.log(error);
  }

}

signupUser();