const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const BlackList = require('./Blacklist')
const nodemailer = require('nodemailer')

const User = require("./user.model");
const Board = require("../boards/board.model");
const Task = require("../tasks/task.model")

const Column = require("../columns/column.model");
const Token = require("../token/token.model");

const getUserById = async (req, res) => {
  const userId = req.params.id;
  console.log(userId)
  
  try {
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
}

const avatarColors = [
  '#dea8dc',
  '#8fbece',
  '#A12312',
  '#924E7D',
  '#7cc388',
  '#1F3A3D',
  '#E63244',
  '#1b82a3',
  '#87ac36'
]

function getRandomColor() {
  const index = Math.floor(Math.random() * avatarColors.length);
  return avatarColors[index];
}

const register = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !password || !email){
    res.status(401).json({message: "Send needed params"})
    return
  }
  try {
    const user = new User({ username, email, password, color: getRandomColor() });
    const existingUser = await User.findOne({ email });
    if (existingUser)
        return res.status(400).json({
            status: "failed",
            data: [],
            message: "It seems you already have an account, please log in instead.",
        });
    await user.save();

    const tasks = await Promise.all([
          new Task({ 
            title: "Set up development environment",
        }).save(),
        new Task({ 
            title: "Define project requirements" 
        }).save(),
        new Task({ 
            title: "Develop homepage UI" 
        }).save(),
        new Task({ 
            title: "Design database schema" 
        }).save()
    ]);

    // Create default columns
    const defaultColumns = await Promise.all([
      new Column({
          title: "To do",
          boardId: null, // Will be updated later
          tasks: tasks
      }).save(),
      new Column({ title: "In progress", boardId: null, tasks: [] }).save(),
      new Column({ title: "Done", boardId: null, tasks: [] }).save()
    ]);
  
    // Create a new board
    const defaultBoard = new Board({
        user: user._id,
        name: 'New Board',
        columns: defaultColumns.map(column => column._id),
        tasks: tasks,
        color: 'linear-gradient(23deg, rgba(145,167,244,0.6811974789915967) 0%, rgba(255,77,157,1) 100%)',

    });
    await defaultBoard.save();
  
    // Update boardId for default columns
    await Promise.all(defaultColumns.map(column =>
        Column.findByIdAndUpdate(column._id, { boardId: defaultBoard._id })
    ));
    
    res.status(201).json({
      message: "User successfully registered",
      user: user._id,
      board: defaultBoard,
    })

    // const token = new Token({
    //   userId: user._id,
    //   token: user.generateAccessJWT()
    // })

    // user.token = token.token;
    const token = generateConfirmationToken(user._id)
    console.log(token)

    await sendConfirmationEmail(user.email, token, user._id)
      .then(() => {
        user.token = token;
      }).catch((err) => console.log(err))

  } catch(err){
    res.status(401).json({ error: err.message })
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

    if (!user.verified) {
      return res.status(400).json({message: "Account not verified."})
    }

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch){
      return res.status(401).json({message: "Incorrect password"})
    } 

    let options = {
      maxAge: 60 * 60 * 1000, // would expire in 60minutes
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
      user: req.user
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
    res.status(200).json({ message: "You are logged out!", user: null });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
  res.end();
}

const generateConfirmationToken = (userId) => {
  return jwt.sign({ userId }, process.env.SECRET_KEY, { expiresIn: '1d' });
};

const sendConfirmationEmail = async (email, token, userId) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "a.avram54@gmail.com",
      pass: "srycbjiifcigizvj",
    },
  });
  
  const mailOptions = {
    from: "a.avram54@gmail.com",
    to: email,
    subject: 'Ticked email confirmation',
    html: `<h1>Hello</h1>
          <div><p>Click the link below to confirm your email: </p>
          <a href="${process.env.CLIENT_URL}/user/${userId}/verify/${token}">${process.env.CLIENT_URL}/user/${userId}/verify/${token}<a>
          </div>`
  }

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log('Error occurred. ' + err.message);
      return process.exit(1);
    }

    console.log('Message sent: %s', info.messageId);
    })

}

const confirmEmail = async (req, res) => {
  const tokenParam = req.params.token;
  console.log("here: ", tokenParam)

  if (!tokenParam) {
    return res.status(400).json({ message: 'Invalid token' });
  }

  try {
    const decoded = jwt.verify(tokenParam, process.env.SECRET_KEY);
    const userId = decoded.userId;
    console.log(decoded)
    console.log(userId)

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // const token = user.token;
    // if (!token){
    //   return res.status(400).json({ message: "Invalid link" });
    // }
    await User.findByIdAndUpdate(userId, { verified: true });

    await user.save();
    res.status(200).json({ message: 'Email verified successfully' }); // Returnează un răspuns JSON către client

    //await login(req, res)

    // Redirect to home page after confirmation
    //res.redirect('/boards');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const sendInvitationLink = async (req, res) => {

  let email = req.body.email;
  let invitedBy = req.body.invitedBy;
  let boardId = req.params.boardId;
  let userId = req.params.userId;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "a.avram54@gmail.com",
      pass: "srycbjiifcigizvj",
    },
  });
  
  const mailOptions = {
    from: invitedBy,
    to: email,
    subject: `${invitedBy} invited you to a Ticked Board`,
    html: `<h1>Hello!</h1>
          <div>
            <p>${invitedBy} invited you to a Ticked Board</p>
            <p>Join them on Trello to collaborate, manage projects, and reach new productivity peaks.</p>
            <a href="${process.env.CLIENT_URL}/board/${boardId}/join/${userId}">Go to board<a>
          </div>`
  }

  try{
    transporter.sendMail(mailOptions, (err, info) => {
  
      console.log('Message sent: %s', info.messageId);
      });

      res.status(200).json({ message: 'Email invitation sent!' });
  
  } catch (err) {
    res.status(500).json({ message: err.message });
  };

}


module.exports = { getUserById, login, register, logout, confirmEmail, sendInvitationLink }
  