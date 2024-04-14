const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
    username: {
      type: String, 
      required: true, 
      unique: true,
      
    },
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    token: { type: String },
    verified: { type: Boolean },
    color: { type : String },
},{ timestamps: true}
);

userSchema.pre('save', function (next) {
  const user = this;

  if (!user.isModified('password')) return next();
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);
        user.password = hash;
        console.log(user.password)
        next();
    });
});
});


userSchema.methods.comparePassword = async function (password) {
  try {
    const match = await bcrypt.compare(password, this.password);
    return match;
  } catch (error) {
    throw error;
  }
};

userSchema.methods.generateAccessJWT = function () {
  let payload = {
    id: this._id,
  };
  return jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: '1h',
  })
}
 
const User = mongoose.model('User', userSchema);
module.exports = User;