const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('connected');
});

mongoose.connection.on('error', (err) => {
  console.log('error', err);
});

// const theTask = Task.create({
//   description: 'Learn the mongoose library',
//   completed: false,
// });

// const chA = () => {
//   a = theTask;
//   console.log({ a });
// };

// const chB = async () => {
//   b = await theTask;
//   console.log({ b });
// };

// chA();
// chB();
