import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/usersModel.js";
import jwt from 'jsonwebtoken'; 
import generateToken from "../utils/generateToken.js";
// @desc Auth & get Token
// @route POST /api/users/login
// access public
const authUser = asyncHandler(async(req, res)=> {
  const {email,password} = req.body;
  // console.log(req.body);
  const user = await User.findOne({email});
  // on appelle la fonction qui compare les mots de pass ici
  if(user && (await user.matchPassword(password))){
    const token = generateToken(res, user._id)
    res.json(
      {
        _id: user._id,
       name: user.name,
       email: user.email,
       password: user.password,
       isAdmin: user.isAdmin,
       token,
      //  token
      }
    )
  }
  else {
    res.status(401);
    throw new Error('Invalid email or password ');
  }
});

// @desc logout user / clear cookie
// @route POST /api/users
// access public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    const token = generateToken(res, user._id); // Génère et renvoie le token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token, // Inclure le token ici
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});


// @desc logout user / clear cookie
// @route POST /api/users/logout
// access private
const logoutUser = asyncHandler(async(req, res)=> {
  res.cookie('jwt','', {
    httpOnly: true,
    expires: new Date(0)
  });
  res.status(200).json({message: 'Logged out successfully '});
});

// @desc logout GETuser profile
// @route POST /api/users/profile
// access private
const getUserProfile = asyncHandler(async(req, res)=> {
  // throw new Error('Some error');
  res.send('get user profile');
});

// @desc logout update user  profile
// @route PUT /api/users/profile
// access public
const updateUserProfile = asyncHandler(async(req, res)=> {
  // throw new Error('Some error');
   const user = await User.findById(req.user._id) ;
  // res.send('get user');
  if (user){
    user.name = req.body.name || user.name;
    user.email = req.body.email  || user.email;
    if(req.body.password) {
    user.password = req.body.password;
    }
    const updateUser = await user.save();
    res.status(200).json({
      _id: updateUser._id,
      name: updateUser.name,
      email: updateUser.email,
      isAdmin: updateUser.isAdmin,
    });

  }
  else{
    res.status(404);
    throw new Error('User not found ');
  }
});

// @desc Get users 
// @route GET /api/users/profile
// access Private/Admin
const getUsers = asyncHandler(async(req, res)=> {
  // throw new Error('Some error');
  res.send('get user');
});

// @desc Get users  by ID
// @route PUT /api/users/:id
// access Private/Admin
const updateUser = asyncHandler((req, res)=> {
  // throw new Error('Some error');
  res.send('update user');
});

// @desc Update user
// @route PUT /api/users/profile
// access Private/Admin
const getUserByID = asyncHandler(async(req, res)=> {
  // throw new Error('Some error');
  res.send('get user by ID');
});



// @desc Get users 
// @route DELETE /api/users/profile
// access Private/Admin
const deleteUser = asyncHandler(async(req, res)=> {
  // throw new Error('Some error');
  res.send('delete user ');
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserByID,
  updateUser
}
  