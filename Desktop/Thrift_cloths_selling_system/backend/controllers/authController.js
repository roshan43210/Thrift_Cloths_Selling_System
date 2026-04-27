import User from '../models/User.js';
import Otp from '../models/Otp.js';
import { generateToken } from '../utils/generateToken.js';
import { generateOTP } from '../utils/otp.js';
import { sendOTP } from '../utils/email.js';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, role: role || 'buyer', isVerified: false });

    const otpCode = generateOTP();
    await Otp.create({ email, code: otpCode, expiresAt: new Date(Date.now() + 10 * 60 * 1000) });

    const emailResult = await sendOTP(email, otpCode);

    if (!emailResult.success) {
      console.log(`OTP for ${email}: ${otpCode}`);
    }

    res.status(201).json({ message: 'OTP sent to email. Please verify.', email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const otpRecord = await Otp.findOne({ email, code: otp });
    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const user = await User.findOneAndUpdate({ email }, { isVerified: true }, { new: true });
    await Otp.deleteOne({ _id: otpRecord._id });

    res.status(200).json({
      message: 'Email verified successfully',
      token: generateToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    await Otp.deleteMany({ email });

    const otpCode = generateOTP();
    await Otp.create({ email, code: otpCode, expiresAt: new Date(Date.now() + 10 * 60 * 1000) });
    await sendOTP(email, otpCode);

    res.status(200).json({ message: 'New OTP sent to email', email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      if (!user.isVerified) {
        return res.status(403).json({ message: 'Please verify your email first' });
      }
      res.json({
        token: generateToken(user._id),
        user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { tokenId } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, picture, sub } = ticket.getPayload();

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, googleId: sub, avatar: picture, isVerified: true });
    }

    res.json({
      token: generateToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, esewaId, khaltiId } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, address, esewaId, khaltiId },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

