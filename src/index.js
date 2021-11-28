require('./mongoose');
// const User = require('./models/User');
// const Task = require('./models/Task');
const userRouter = require('./routers/User');
const taskRouter = require('./routers/Task');
const express = require('express');
const multer = require('multer');
const upload = multer({
  dest: 'images',
  limits: {
    fileSize: 2000000,
  },
  fileFilter(req, file, cb) {
    // if (!file.originalname.endsWith('.pdf')) {
    if (!file.originalname.match(/\.(doc|docx)$/)) {
      return cb(new Error('File must be a word doc'));
    }
    cb(undefined, true);
  },
});
const app = express();
app.post(
  '/upload',
  upload.single('uploadFile'),
  (req, res) => {
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

// app.use((req, res, next) => {
//   if (req.method === 'GET') {
//     return res.send('get what?')
//   }
//   console.log(req.method, req.path);
//   next();
// });

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

const port = process.env.PORT;

app.listen(port, () => console.log('done connected'));

// const main = async () => {
//   const task = await Task.findById('619e1ecb523a3ead4ba29ab4');
//   await task.populate('creator');
//   console.log(task.creator);

//   const user = await User.findById('619e1cb79221bf3728731695');
//   await user.populate('tasks');
//   console.log(user.tasks);
// };

// main();
