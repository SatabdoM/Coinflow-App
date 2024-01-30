const express = require("express");
const AccountsRouter = express.Router();
const { User, Accounts } = require("../db");
const JWT_SECRET = require("../config");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("../middlewares");
const { default: mongoose } = require("mongoose");

AccountsRouter.get("/balance", authMiddleware, async (req, res) => {
  const userId = req.userId;
  const userDetails=await User.findOne({
    _id: userId
  })
  const account = await Accounts.findOne({
    userId: userId,
  });
  return res.status(200).json({
    firstname:userDetails.firstname,
    lastname:userDetails.lastname,
    balance: account.balance,
    email:userDetails.username,
  });
});

AccountsRouter.post("/transfer", authMiddleware, async (req, res) => {
  //starting a transaction session
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { amount, receiverId } = req.body;
    //Fetch the senders account
    const senderId = req.userId;
    const senderAccount = await Accounts.findOne({ userId: senderId }).session(
      session
    );
    if (!senderAccount || senderAccount.balance < amount) {
      //abort the transaction
      await session.abortTransaction();
      return res.status(403).json({
        message: "Insufficient Balance",
      });
    }
    const receiverAccount = await Accounts.findOne({
      userId: receiverId,
    }).session(session);
    //if reciever does not exist then abort transaction
    if (!receiverAccount) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Invalid Account",
      });
    }
    //performing the transfer
    await Accounts.updateOne(
      { userId: senderId },
      { $inc: { balance: -amount } }
    ).session(session);
    await Accounts.updateOne(
      { userId: receiverId },
      { $inc: { balance: amount } }
    ).session(session);
    //Commit the transaction
    await session.commitTransaction();

    return res.status(200).json({
      message: "Transfer Successful",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  } finally {
    session.endSession();
  }
});

module.exports = AccountsRouter;
