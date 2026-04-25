const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  createUser,
  deleteUser,
} = require('../controllers/userController');

router.get('/', getAllUsers);

router.post('/', createUser);

router.delete('/:id', deleteUser);

module.exports = router;