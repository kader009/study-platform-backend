import jwt from 'jsonwebtoken';
import { getUserCollection } from '../models/userModel.js';

// Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await getUserCollection().findOne({ email });

  if (!user) {
    res.status(404).send({ error: 'user not found' });
  }

  if (user.password !== password) {
    res.status(401).send({ error: 'invalid password' });
  }

  const token = jwt.sign(
    { email: user.email, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '7d' }
  );

  res.status(200).send({
    success: true,
    message: 'Login successful',
    user,
    token,
  });
};

// Social login
export const socialLogin = async (req, res) => {
  const { name, email, image } = req.body;

  try {
    let user = await getUserCollection().findOne({ email });

    if (!user) {
      const newUser = {
        name,
        email,
        image,
        role: 'student',
        createdAt: new Date(),
      };

      let result = await getUserCollection().insertOne(newUser);
      user = result;
    }

    const token = jwt.sign(
      { email: user.email, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).send({
      success: true,
      message: 'Login or register successful',
      user,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to login or register',
    });
  }
};
