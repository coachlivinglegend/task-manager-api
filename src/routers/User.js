const express = require('express');
const requireAuth = require('../middlewares/auth');
const User = require('../models/User');
const multer = require('multer');
const sharp = require('sharp');
const { sendWelcomeMail, sendGoodbyeMail } = require('../emails/account');
const router = new express.Router();

const upload = multer({
  // dest: 'avatars',
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|png)$/)) {
      return cb(new Error('File must be an image'));
    }
    cb(undefined, true);
  },
});

router.post('/users', async (req, res) => {
  try {
    const user = await User.create(req.body);
    const token = await user.generateAuthToken();

    sendWelcomeMail(user.email, user.name);
    res.status(200).send({ user, token });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }

  // User.create(req.body)
  //   .then((data) => {
  //     console.log(data);
  //     res.status(201).send(data);
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //     res.status(400).send(error);
  //   });
});

router.post('/users/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.loginWithEmailAndPassword(email, password);
    const token = await user.generateAuthToken();
    res.status(200).send({ user, token });
  } catch (e) {
    res.status(404).send(e);
  }
});

router.post('/users/logout', requireAuth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();

    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

router.post('/users/logoutAll', requireAuth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();

    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

router.get('/users/me', requireAuth, async (req, res) => {
  res.send(req.user);
  // try {
  //   const user = await User.find({});
  //   res.status(201).send(user);
  // } catch (error) {
  //   console.log(error);
  //   res.status(500).send(error);
  // }

  // User.find({})
  //   .then((data) => {
  //     console.log(data);
  //     res.status(201).send(data);
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //     res.status(500).send(error);
  //   });
});

router.get('/users/:id', requireAuth, async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.id });
    res.status(201).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }

  // User.findById({ _id: req.params.id })
  //   .then((data) => {
  //     console.log(data);
  //     res.status(201).send(data);
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //     res.status(500).send(error);
  //   });
});

router.patch('/users/me', requireAuth, async (req, res) => {
  const updates = Object.keys(req.body);
  const validProps = ['name', 'email', 'password', 'age'];
  const isValidOperation = updates.every((update) =>
    validProps.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: 'property not found' });
  }
  try {
    // const user = await User.findById(req.user._id);
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    // const user = await User.findOneAndUpdate({ id: req.params.id }, req.body, {
    //   new: true,
    //   runValidators: true,
    // });
    // console.log('user');

    // if (!user) {
    //   return res.status(404).send();
    // }

    res.send(req.user);
  } catch (error) {
    console.log('error here');
    res.status(400).send(error);
  }
});

router.delete('/users/me', requireAuth, async (req, res) => {
  try {
    // const user = await User.findByIdAndDelete(req.user._id);

    // if (!user) {
    //   return res.status(400).send();
    // }

    await req.user.remove();
    sendGoodbyeMail(req.user.email, req.user.name);
    res.send(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post(
  '/users/me/avatar',
  requireAuth,
  upload.single('avatar'),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 240, height: 320 })
      .png()
      .toBuffer();
    // console.log(req.file.buffer);
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete(
  '/users/me/avatar',
  requireAuth,
  async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.get('/users/me/avatar', requireAuth, async (req, res) => {
  try {
    const userAvatarBuffer = req.user.avatar;

    if (!userAvatarBuffer) {
      throw new Error();
    }
    res.set('Content-Type', 'image/jpg');
    res.send(userAvatarBuffer);
  } catch (error) {
    res.status(404).send();
  }
});

router.get('/users/:id/avatar', async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);

    if (!user || !user.avatar) {
      throw new Error();
    }

    res.set('Content-Type', 'image/png');
    res.send(user.avatar);
  } catch (error) {
    res.status(404).send();
  }
});

module.exports = router;
