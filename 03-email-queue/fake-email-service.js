async function sendEmail(to, subject) {

  console.log("Sending Email...");
  
  await new Promise((resolve) =>
    setTimeout(resolve, 3000)
  );

  console.log(`
Email Sent Successfully

To: ${to}
Subject: ${subject}
  `);

}

module.exports = sendEmail;