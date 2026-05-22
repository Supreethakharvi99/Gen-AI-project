const {Router} = require('express')

const {registeruserController,loginUserController,logoutUserController} = require("../controllers/auth.controller")

const authRouter = Router()
/**
 * @route POST/api/auth/register
 * @description Register a new user
 * @access Public
 */

authRouter.post("/register",registeruserController)

/**
 * @route POST/api/auth/login
 * @description login user with email and password
 * @access Public
 */
authRouter.post("/login",loginUserController)

/**
 *  @route GET/api/auth/logout
 * @description clear token from user cookie and add the token in blacklist
 * @access Public
 */
authRouter.get("/logout",logoutUserController)


module.exports = authRouter