const express = require('express');
const router = express.Router();

const user = require('../utils/user');

router.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    server: 'alive',
  });
});

router.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: 'one or more fields are not filled',
    });
  }

  const data = {
    email,
    password,
  };

  const newUser = await user.create(data);
  if (newUser[1]) {
    newUser[1].password = password; // Optionally mask the password before sending response
    res.status(201).json(newUser);
  } else {
    res.status(400).json(newUser);
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(401).json({
      error: 'email or password must not be empty',
    });
  }

  const data = {
    email,
    password,
  };

  const findUser = await user.validate(data);

  if (findUser[0]) {
    res.status(200).json(findUser);
  } else if (findUser[0] === 'google user') {
    res.status(401).json({
      error: findUser[1],
    });
  } else {
    res.status(401).json({
      error: 'invalid email or password',
    });
  }
});


router.get("/user", async (req, res) => {
  const { userid } = req.query;
  if (!userid) {
    return res.status(401).json({
      error: "UserId required",
    });
  }
  const getUser = await user.getById(userid);
  res.status(200).json(getUser);
});


router.get("/users", async (req, res) => {
  try {
    const users = await user.getAll();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
