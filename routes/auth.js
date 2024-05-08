const express = require("express")
const router = express.Router()
const User = require("../modals/userModal")
const bcrypt = require("bcrypt")
const nodemailer = require("nodemailer")
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const verifyToken = require("../utils/verifyToken")

// user-register
router.post("/register", async (req, res) => {
    const { username, email, password, phone } = req.body
    if (username && email && password && phone) {
        try {
            const existingUser = await User.findOne({ $or: [{ email }, { phone}] })
            if (existingUser) {
                res.json({
                    StatusCode: 409,
                    Message: 'email or phone number is already taken'
                })
            }
            const stringPassword = String(password);
            const salt = bcrypt.genSaltSync(10);
            const hashPassword = bcrypt.hashSync(stringPassword, salt);
            const newUser = User({
                username,
                email,
                password: hashPassword,
                phone
            })
            await newUser.save()
            res.json({
                StatusCode: 201,
                data: {
                    username: username,
                    email: email,
                    phone: phone,
                },
                Message: "account register successful",
            })
        } catch (error) {
            res.json({
                StatusCode: 500,
                Message: "Something went wrong. Please try again later",
                error: error.message
            })
        }
    } else {
        const errors = [];
        if (!username) errors.push("Username is missing");
        if (!email) errors.push("Email is missing");
        if (!password) errors.push("Password is missing");
        if (!phone) errors.push("Phone number is missing");
        res.json({
            StatusCode: 400,
            Message: "please provide all fields properly",
            MissingFields: errors,
        })
    }
})

// user-login
router.post("/login", async (req, res) => {
    const { email, password } = req.body
    if (email, password) {
        try {
            const existingUser = await User.findOne({ email })
            if (existingUser) {
                const token = jwt.sign({userId:email},process.env.JWT_SECRET,{expiresIn:'10s'})
                const passwordMatch = await bcrypt.compare(password, existingUser.password)
                if (passwordMatch) {
                    res.json({
                        StatusCode: 200,
                        Message: "login successfully",
                        AcessToken:token
                    })
                } else {
                    res.json({
                        StatusCode: 400,
                        Message: 'invalid credentials'
                    })
                }
            } else {
                res.json({
                    StatusCode: 400,
                    Message: 'user is not existing'
                })
            }
        } catch (error) {
            res.json({
                StatusCode: 500,
                Message: "Something went wrong. Please try again later",
                error: error.message
            })
        }
    } else {
        const errors = [];
        if (!email) errors.push("Email is missing");
        if (!password) errors.push("Password is missing");
        res.json({
            StatusCode: 400,
            Message: "please provide all email and password fields properly",
            MissingFields: errors
        })
    }
})

// forgot-password
router.post("/forgotpassword", async (req, res) => {
    const { email } = req.body
    const existingUser = await User.findOne({ email })
    if (existingUser) {
        const resetToken = crypto.randomBytes(20).toString('hex');
        const expirationDate = new Date();
        expirationDate.setHours(expirationDate.getHours() + 1); 
        existingUser.resetToken = resetToken;
        existingUser.resetTokenExpires = expirationDate
        await  existingUser.save()
        const resetLink = `http://localhost:5000/users/resetpassword?token=${resetToken}`;
        const mailOptions = {
            from: 'mosalman1098@gmail.com',
            to: email,
            subject: 'Password Reset',
            text: `Click on the following link to reset your password: ${resetLink}`,
        };
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'mosalman1098@gmail.com',
                pass: 'wcdb audf qstz zhot',
            },
        });
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ message: 'Error sending email', error });
            }

            res.status(200).json({ message: 'Email sent successfully', info });
        });
    } else {
        res.json({
            StatusCode: 400,
            Message: 'user is not existing'
        })
    }
})

// reset password
router.post("/resetpassword",async (req,res)=>{
    const  token = req.params.token
    const  {newpassword,currentpassword} =  req.body
    const user = await  User.findOne({
      passwordResetToken:token,
      passwordResetTokenExpire:{$gt:new Date()}
    })
    if(!user){
        res.json({
            StatusCode: 400,
            Message: 'Invalid or expired reset token'
        })
    }
    const passwordMatch = await bcrypt.compare(currentpassword, user.password)
    if(passwordMatch){
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(newpassword, salt);
        user.password = hashPassword
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpire = undefined;
        await user.save()
        res.json({
            StatusCode: 200,
            Message: "password reset sucessfully",
        })
    }else{
        res.json({
            StatusCode: 400,
            Message: "currentpassword is wrong!",
        }) 
    }  
})

router.get("/details",verifyToken,(req,res)=>{
    res.json({
        data:"welcome to louna studio"
    })
})

module.exports = router