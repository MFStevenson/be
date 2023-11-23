const {
  selectAllUsers,
  selectUser,
  checkUserExists,
} = require("../models/users-model");

exports.getUsers = (req, res, next) => {
  selectAllUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getUsername = (req, res, next) => {
  const { username } = req.params;

  checkUserExists(username)
    .then(() => {
      return selectUser(username);
    })
    .then((user) => {
      return res.status(200).send({ user });
    })
    .catch(next);

  selectUser();
};

