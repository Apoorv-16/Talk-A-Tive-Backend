const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const bcrypt = require("bcryptjs")

//@description     Get or Search all users
//@route           GET /api/user?search=
//@access          Public
const allUsers = asyncHandler(async (req, res) => {
  
  const keyword = req.query.search
  
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
    console.log(keyword);

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

//@description     Register new user
//@route           POST /api/user/
//@access          Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Feilds");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

//@description     Auth the user
//@route           POST /api/users/login
//@access          Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
 

  const user = await User.findOne({ email });
  console.log(email);
  console.log(password === user.password);
  // to check the encrypted password
  bcrypt.compare(password, user.password, (err,response) =>{
    if(err){
      
      console.log("Invalid email or password found inside error variabl err");
      res.status(401);
      throw new Error("Invalid Email or Password");

    }

    if(response){
      console.log("response recieved by password validation of bcrypt function");
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        pic: user.pic,
        token: generateToken(user._id),
    });


    }

    else{
      console.log("Invalid email or password found inside else part of compare function");
      res.status(401);
      throw new Error("Invalid Email or Password");
    }
  })
  // if (user && (password === user.password)) {
  //   res.json({
  //     _id: user._id,
  //     name: user.name,
  //     email: user.email,
  //     isAdmin: user.isAdmin,
  //     pic: user.pic,
  //     token: generateToken(user._id),
  //   });
    
  // } else {
  //   res.status(401);
  //   throw new Error("Invalid Email or Password");
  // }


});

module.exports = { allUsers, registerUser, authUser };