import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Register User

export const register = async(req, res) => {
    try{
        const {firstName, lastName, password, email, picturePath, friends, location, occupation} = req.body;
        const passwordHash = bcrypt.hashSync(password, 10);
        const newUser = new User({
            firstName,
            lastName, 
            password: passwordHash,
            email, 
            picturePath, 
            friends, 
            location, 
            occupation,
            viewedProfile: Math.floor(Math.random()*10000),
            impressions:  Math.floor(Math.random()*10000),
        });

        const savedUser = await newUser.save();
        res.status(200).json(savedUser);
    }
    catch(error){
        console.log(error);
        res.status(500).json({  error: error.message })
    }
};

//Login

export const login = async(req, res) => {
    try{

        const { email, password } = req.body;
        const user = await User.findOne({email:email});
        console.log(user)
        if(!user){
            res.status(400).json({message:'User not exist'});
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            res.status(400).json({message:'Invalid Password'});
        }

        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET);
        
        delete user.password;
        
        res.status(200).json({token, user});

    }catch(error){
        console.log(error);
    }
}