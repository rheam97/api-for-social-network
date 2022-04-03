const { User, Thought } = require("../models");

const userController = {
  // get all users
  getAllUsers(req, res) {
    User.find({})
      .populate({
        path: "friends",
        select: "-__v",
      }, {
        path: "thoughts",
        select: "-__v",
      })
      .select("-__v")
      .sort({ _id: -1 })
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  //get user by id
  getUserById({ params }, res) {
    User.findOne({ _id: params.id })
      .populate({
        path: "friends",
        select: "-__v",
      }, {
        path: "thoughts",
        select: "-__v",
      })
      .select("-__v")
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No user found with this id" });
          return;
        }
        res.json(dbPUserData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  //post new user
  createUser({ body }, res) {
    User.create(body)
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.status(400).json(err));
  },

  //update user by id
  updateUserbyId({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No user found with this id." });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => {
        res.json(err);
      });
  },

  //delete user by id (delete thoughts as well and user from friends array)
  deleteUserbyId({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No user found with this id" });
          return;
        }
        User.updateMany(
          { _id: { $in: dbUserData.friends } },
          { $pull: { friends: params.id } }
        )
          .then(() => {
            Thought.deleteMany({ username: params.username })
              .then(() => {
                res.json(dbUserData);
              })
              .catch((err) => res.status(400).json(err));
          })
          .catch((err) => res.status(400).json(err));
      })
      .catch((err) => res.status(400).json(err));
  },

// add friend
addFriend({ params}, res) {
    User.findOneAndUpdate(
      { _id: params.id },
      { $push: { friends: params.friendId } },
      { new: true, runValidators: true }
    )
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No user found with this id" });
          return;
        }
        User.findOneAndUpdate(
            { _id: params.friendId },
            { $push: { friends: params.id } },
            { new: true, runValidators: true }
          )
          .then((dbFriendData)=> {
              if(!dbFriendData){
                res.status(404).json({ message: "No user found with this id" });
                return;
              }
      })
      .catch((err) => res.json(err));
    })
    .catch((err) => res.json(err));
  },

// delete friend
deleteFriend({ params }, res) {
    User.findOneAndDelete(
      { _id: params.id },
      { $pull: { friends: params.friendId  } },
      { new: true }
    )
      .then((dbUserData) => {
        if (!dbUserData) {
            res.status(404).json({ message: "No user found with this id" });
            return;
          }
          User.findOneAndUpdate(
            { _id: params.friendId },
            { $pull: { friends: params.id } },
            { new: true, runValidators: true }
          )
          .then((dbFriendData)=> {
              if(!dbFriendData){
                res.status(404).json({ message: "No user found with this id" });
                return;
              }
          })
          .catch((err) => res.json(err));
      })
      .catch((err) => res.json(err));
  }
};
