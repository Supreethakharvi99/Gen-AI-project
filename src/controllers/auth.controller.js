const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

/**
 * @name registerUserController
 * @description register a new user, expects username, email and password in the request body
 * @access Public
 */
async function registeruserController(req, res) {
  try {
    const { username, email, password } = req.body;

    //validation
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Please provide all the required fields",
      });
    }

    //check existing user
    const isUerAlreadyExists = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (isUerAlreadyExists) {
        /*isUerAlreadyExists.username == username */
      return res.status(400).json({
        message: "Account already exists with this email address or username",
      });
    }

    //hash password
    const hash = await bcrypt.hash(password, 10);
    //create user
    const user = await userModel.create({
    username,
    email,
    password: hash
  })

  //Generate token
  const token = jwt.sign({
    id:user._id, 
    username: user.username
  },
    process.env.JWT_SECRET,
    {expiresIn: "1d"}
  );

  //set cookie
  res.cookie("token",token)

  //Response
  res.status(201).json({
    message: "User registered successfully",
    user: {
        id: user._id,
        username: user.username,
        email:user.email
  

    }
})


  } catch (error) {
    console.error(error);
    return res.status(500).json({
        message: "Internal server error"
    })
  }
  
}

/**
 * @name loginUserController
 * @description login a user, expects email and password in the requeest body
 * @access Public
*/ 

async function loginUserController(req,res){
    try {
        const {email, password} = req.body
        const user = await userModel.findOne({email})

        if(!user){
            return res.status(500).json({
                message: "Invalid email or password"
            })
        }

        const isPasswordvalid = await bcrypt.compare(password, user.password)
        if(!isPasswordvalid){
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }
        const token = jwt.sign({
            id:user._id,
            username: user.username,
        },
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    )
    res.cookie("token",token)
    res.status(200).json({
        message:"User loggedIn successfully.",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
    }catch (error) {
    console.error(error);
    return res.status(500).json({
        message: "Internal server error"
    })
        
    }
}
module.exports = {
  registeruserController,
  loginUserController
};
