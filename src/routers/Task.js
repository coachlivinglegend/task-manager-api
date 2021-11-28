const express = require('express');
const requireAuth = require('../middlewares/auth');
const Task = require('../models/Task');
const router = new express.Router();

router.post('/tasks', requireAuth, (req, res) => {
  Task.create({ ...req.body, creator: req.user._id })
    .then((data) => {
      res.status(201).send(data);
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send(error);
    });
});

router.get('/tasks', requireAuth, async (req, res) => {
  const match = {};
  if (req.query.completed) {
    match.completed = req.query.completed === 'true';
  }
  const sort = {};
  if (req.query.sortBy) {
    const spill = req.query.sortBy.split('_');
    sort[spill[0]] = spill[1] === 'desc' ? -1 : 1;
  }
  try {
    await req.user.populate({
      path: 'tasks',
      match,
      options: {
        limit: parseInt(req.query.limit ?? ''),
        skip: parseInt(req.query.skip ?? ''),
        sort,
      },
    });
    res.send(req.user.tasks);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }

  // Task.find({ creator: req.user._id })
  //   .then((data) => {
  //     console.log(data);
  //     res.status(201).send(data);
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //     res.status(500).send(error);
  //   });
});

router.get('/tasks/:id', requireAuth, async (req, res) => {
  try {
    const _id = req.params.id;
    const task = await Task.findOne({ _id, creator: req.user._id });

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }

  // Task.findById({ _id: req.params.id })
  //   .then((data) => {
  //     console.log(data);
  //     res.status(201).send(data);
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //     res.status(500).send(error);
  //   });
});

router.patch('/tasks/:id', requireAuth, async (req, res) => {
  const updates = Object.keys(req.body);
  const validProps = ['description', 'completed'];
  const isValidOperation = updates.every((update) =>
    validProps.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: 'property not found' });
  }
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, creator: req.user._id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      return res.status(404).send();
    }

    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete('/tasks/:id', requireAuth, async (req, res) => {
  try {
    const task = await Task.findByOneAndDelete({
      _id: req.params.id,
      creator: req.user._id,
    });

    if (!task) {
      return res.status(400).send();
    }

    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
