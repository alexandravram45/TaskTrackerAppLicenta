const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const BlackList = require('./Blacklist')

const User = require("./user.model");

const register = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !password || !email){
    res.status(401).json({message: "Send needed params"})
    return
  }
  try {
    const user = new User({ username, email, password });
    const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({
                status: "failed",
                data: [],
                message: "It seems you already have an account, please log in instead.",
            });
    await user.save();

    res.status(201).json({
      message: "User successfully registered",
      user: user._id
    })
  } catch(err){
    res.status(401).json({ error: err })
  }
};

const login = async (req, res, next) => {
  const { username, password } = req.body

  if (!username || !password){
    res.status(401).json({message: "Send needed params"})
    return
  }
  try {
    const user = await User.findOne({ username })
    if (!user){
      return res.status(404).json({message: "Invalid email or password."})
    }

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch){
      return res.status(401).json({message: "Incorrect password"})
    } 

    let options = {
      maxAge: 20 * 60 * 1000, // would expire in 20minutes
      httpOnly: true, // The cookie is only accessible by the web server
      secure: true,
      sameSite: "None",
  };
  
    const token = user.generateAccessJWT();
    res.cookie("SessionID", token, options);
    
    req.user = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    res.status(201).json({
      message: "User successfully Logged in",
      token: token,
      user: user._id
    })
  } catch(err) {
    res.status(500).json({ 
      status: 'error', 
      code: 500,
      data: [],
      message: "Internal server error",
   })
  }
  res.end();
};

const logout = async (req, res, next) => {
  try {
    const authHeader = req.headers['cookie'];

    if (!authHeader) {
      return res.status(400).json({ message: "Cookie is missing" });
    }

    const cookies = authHeader.split(';').map(cookie => cookie.trim());
    const accessTokenCookie = cookies.find(cookie => cookie.startsWith('SessionID='));

    if (!accessTokenCookie) {
      return res.status(401).json({ message: 'Invalid cookie format' });
    }

    const cookie = accessTokenCookie.split('=')[1];

    // Check if the token is blacklisted
    const checkIfBlacklisted = await BlackList.findOne({ token: cookie });

    if (checkIfBlacklisted) {
      return res.status(401).json({ message: "Token is blacklisted" });
    }

    // Add the token to the blacklist
    const newBlackList = new BlackList({
      token: cookie,
    });

    await newBlackList.save();

    // Clear the cookie on the client side
    res.setHeader('Set-Cookie', 'SessionID=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=None');
    
    // Send a response indicating successful logout
    res.status(200).json({ message: "You are logged out!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
  res.end();
}


const getCurrentUser = async (req, res) => {
  // The current user information is stored in req.user by the authentication middleware
  const currentUser = req.user;

  if (currentUser) {
    res.status(200).json(currentUser);
  } else {
    res.status(401).json({ message: 'User not authenticated' });
  }
};



module.exports = { login, register, logout, getCurrentUser }
  