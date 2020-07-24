const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const User = require("../../models/User");
const { SECRET_KEY } = require("../../config");
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../util/validators");

function generateToken(user) {
  return jwt.sign(
    {
      username: user.username,
      email: user.email,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
}

module.exports = {
  Query: {
    async getData() {
      try {
        const data = await User.find();
        return data;
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  Mutation: {
    async login(_, { username, password }) {
      // validation of user data
      const { errors, valid } = validateLoginInput(username, password);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      // check if user is existing
      const user = await User.findOne({ username });
      if (!user) {
        errors.general = " User not found ";
        throw new UserInputError("User not found", { errors });
        //console.log("User not found");
      }
      //console.log(password);
      //console.log(user.password);
      //
      const match = await bcrypt.compare(password, user.password);
      console.log(match);
      if (!match) {
        errors.general = "Passwords do not match";
        throw new UserInputError("Passwords do not match", { errors });
        // console.log("user.password did not match");
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },

    async register(
      _,
      { registerInput: { name, username, email, password, confirmPassword } }
    ) {
      //Validate User Data
      const { valid, errors } = validateRegisterInput(
        name,
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError("Erorrs", { errors });
      }

      //Make sure UserName Doesn't Exist
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError("Username is taken", {
          errors: {
            username: "This username is taken",
          },
        });
      }

      //Make sure EmailAddress Doesn't Exist
      const emailAddress = await User.findOne({ email });
      if (emailAddress) {
        throw new UserInputError("Email is taken", {
          errors: {
            email: "This email is taken",
          },
        });
      }
      //hash pass and create an auth token
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        name,
        username,
        email,
        password,
      });

      const res = await newUser.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};
