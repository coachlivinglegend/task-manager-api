const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// const msg = {
//   to: 'tomiwabeckley@yahoo.co.uk', // Change to your recipient
//   from: {
//     name: 'Daniel from Welkin',
//     email: 'tomiwabeckley@gmail.com', // Change to your verified sender
//   },
//   fromName: 'Daniel from Welkin',
//   subject: 'Sending with SendGrid is Fun',
//   text: 'and easy to do anywhere, even with Node.js',
//   html: `<strong>and easy to do anywhere, even with Node.js</strong><a href='google.com'>See something </a>`,
// };
// sgMail
//   .send(msg)
//   .then(() => {
//     console.log('Email sent');
//   })
//   .catch((error) => {
//     console.error(error);
//   });

const sendAMail = (msg) => {
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent');
    })
    .catch((error) => {
      console.error(error);
    });
};

const sendWelcomeMail = (email, name) => {
  const msg = {
    to: email, // Change to your recipient
    from: {
      name: 'Daniel from Welkin Int',
      email: 'daniel.beckley@welkincollege.com.ng', // Change to your verified sender
    },
    subject: 'Welcome to WebDV.',
    text: `Hey ${name ?? ''}, We gon die here, on God.`,
  };
  sendAMail(msg);
};

const sendGoodbyeMail = (email, name) => {
  const msg = {
    to: email, // Change to your recipient
    from: {
      name: 'Daniel from Welkin Int',
      email: 'daniel.beckley@welkincollege.com.ng', // Change to your verified sender
    },
    subject: 'Haba, bro.',
    text: `${name ?? ''}, My brother man!, why na?`,
  };
  sendAMail(msg);
};

module.exports = {
  sendWelcomeMail,
  sendGoodbyeMail
}