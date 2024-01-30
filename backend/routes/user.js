const express = require("express");
const userRouter = express.Router();
const zod = require("zod");
const { User, Accounts } = require("../db");
const JWT_SECRET = require("../config");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("../middlewares");

const SignUpschema = zod.object({
  username: zod.string(),
  firstname: zod.string(),
  lastname: zod.string(),
  password: zod.string(),
});

userRouter.post("/signup", async (req, res) => {
  try {
    const { success } = SignUpschema.safeParse(req.body);
    if (!success) {
      return res.status(411).json({
        msg: "Email Already Taken/ Incorrect Inputs",
      });
    }

    const existingUser = await User.findOne({
      username: req.body.username,
    });

    if (existingUser) {
      return res.status(411).json({
        msg: "User ALready Exists",
      });
    }
    const user = await User.create({
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      password: req.body.password,
    });
    const userId = user._id;

    await Accounts.create({
      userId: userId,
      balance: 1 + Math.random() * 1000,
    });
    const token = jwt.sign({ userId }, JWT_SECRET);
    // console.log(token);
    return res.status(200).json({
      messege: "User Created Successfully",
      token: token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Internal Server Error",
    });
  }
});
const SignInSchema = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});

userRouter.post("/signin", async (req, res) => {
  try {
    const { success } = SignInSchema.safeParse(req.body);
    if (!success) {
      return res.status(411).json({
        msg: "Invalid Inputs Please try again",
      });
    }
    const findUser = await User.findOne({
      username: req.body.username,
      password: req.body.password,
    });
    if (!findUser) {
      return res.status(411).json({
        msg: "User Does not exist",
      });
    }
    const userId = findUser._id;
    const signInToken = jwt.sign({ userId }, JWT_SECRET);
    console.log(signInToken);
    return res.status(200).json({
      token: signInToken,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Internal Server Error",
    });
  }
});
userRouter.post("/findUser", authMiddleware, async (req, res) => {
  const findUserId = req.body.userId;
  // console.log(userId);
  try {
    const user = await User.findOne({ _id: findUserId});
    console.log(user);
    return res.status(200).json({
      firstName: user.firstname,
      lastName: user.lastname,
    });
  } catch (error) {
    return res.status(400).json({
      msg: "User Not Found",
    });
  }
});
const updateSchema = zod.object({
  firstname: zod.string().optional(),
  lastname: zod.string().optional(),
  password: zod.string().optional(),
});
userRouter.put("/", authMiddleware, async (req, res) => {
  const { success } = updateSchema.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      msg: "Error while updating information 1",
    });
  }
  const user = req.userId;
  try {
    console.log(user);
    await User.updateOne({ _id: user }, req.body);
    return res.status(200).json({
      msg: "User Information Updated Successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      msg: "Error in updating user information 2",
    });
  }
});

userRouter.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";
  const users = await User.find({
    $or: [
      { firstname: { $regex: filter, $options: "i" } },
      { lastname: { $regex: filter, $options: "i" } },
    ],
  });
  res.json({
    user: users.map((user) => ({
      username: user.username,
      firstName: user.firstname,
      lastName: user.lastname,
      _id: user._id,
    })),
  });
});
module.exports = userRouter;
