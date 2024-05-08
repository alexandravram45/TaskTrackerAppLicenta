const mongoose = require("mongoose")
const Token = require('./token.model')


const getToken = async (req, res) => {
    const id = req.params.id;
    try {
      
      const token = await Token.findOne({token: id})
  
      if (!token) {
        return res.status(404).json({ message: 'Token not found' });
      }
      res.json(token);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  }

  module.exports = { getToken }