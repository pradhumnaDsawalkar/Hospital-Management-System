const express = require('express');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, password, role, ...otherDetails } = req.body;

  console.log('Received data:', req.body);

  try {
    let user;

    if (role === 'doctor') {
      user = await Doctor.findOne({ email });

      // If doctor doesn't exist, create new one
      if (!user) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newDoctor = new Doctor({
          email,
          password: hashedPassword,
          role,
          ...otherDetails, // include fields like firstName, lastName, phoneNumber, etc.
        });

        await newDoctor.save();
        user = newDoctor;
      }

    } else if (role === 'admin') {
      user = await Admin.findOne({ email });

      // If admin doesn't exist, create new one
      if (!user) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({
          email,
          password: hashedPassword,
          role,
          ...otherDetails,
        });

        await Admin.save();
        user = Admin;
      }

    } else {
      // Normal user (patient)
      user = await User.findOne({ email, role });
      if (!user) {
        return res.status(400).send({ error: 'Invalid email or role' });
      }
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ error: 'Invalid password' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, 'your_jwt_secret', { expiresIn: '24h' });

    res.send({ token, role: user.role, message: 'Login successful' });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).send({ error: 'Server error' });
  }
});

module.exports = router;
