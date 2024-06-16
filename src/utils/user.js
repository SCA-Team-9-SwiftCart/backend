const User = require("../models/user");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const crypto = require("crypto");

const create = async ({ email, password }) => {
  try {
    if (await User.findOne({ email })) {
      return [false, "User already exists, kindly log in."];
    }

    const hash = await bcrypt.hash(password, saltRounds);
    // const token = crypto.randomBytes(20).toString("hex"); // Generate random token
    const token = generateOtp(4); // Generate 4 random token
    console.log(token)

    const newUser = new User({
      email,
      password: hash,
      verificationToken: token,
      verificationTokenExpiry: Date.now() + 3600000, // 1 hour from now
    });

    if (await newUser.save()) {
      return [true, newUser];
    }
  } catch (error) {
    return [false, error.message];
  }
};

/* Return user with specified id */
const getById = async (id) => {
  const user = await User.findById(id);
  return user;
};

/* Return user with specified email */
const getByEmail = async (email) => {
  const user = await User.findOne({ email: email });
  return user;
};

/* Return all users */
const getAll = async () => {
  return await User.find();
};

// validate user login request
const validate = async ({ email, password }) => {
  const isValidUser = await User.findOne({ email: email });
  if (isValidUser && isValidUser.googleId) {
    return [
      "google user",
      "This account was created with google, kindly log in with google or reset password to create a new password",
    ];
  } else if (isValidUser) {
    return [await bcrypt.compare(password, isValidUser.password), isValidUser];
  }
  return false;
};

// changes user password
const updatePassword = async (password, userId) => {
  try {
    const hash = await bcrypt.hash(password, saltRounds);

    const update = await User.updateOne(
      { _id: userId },
      {
        $set: {
          password: hash,
        },
      }
    );
    if (update.acknowledged) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};

const generateOtp = function(length) {
  let otp = '';
  const number = function() {
    return Math.floor(Math.random() * 10);
  }

  while (otp.length < length) {
    otp += number();
  }
  
  return Number(otp);
}

module.exports = {
  create,
  validate,
  getById,
  getByEmail,
  getAll,
  updatePassword,
};
