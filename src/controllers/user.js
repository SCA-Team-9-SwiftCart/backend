const express = require('express');
const router = express.Router();
const user = require("../utils/user");
// const sendVerificationEmail = require("../utils/emailServices");

router.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    server: 'alive',
  });
});

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "One or more fields are not filled",
    });
  }

  const data = {
    email,
    password,
  };

  try {
    const newUserResult = await user.create(data);

    if (!newUserResult[0]) {
      return res.status(400).json({
        error: newUserResult[1], // Assuming newUser returns [false, error] in case of failure
      });
    }

    const newUser = newUserResult[1];

    // Send verification email
    const token = newUser.verificationToken; // Assuming user schema has verificationToken field
    await sendVerificationEmail(email, token);

    // Optionally mask the password before sending response
    newUser.password = password;

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error signing up user:", error);
    res.status(500).json({
      error: "Internal server error",
    });
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
