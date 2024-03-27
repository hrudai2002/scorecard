import { User } from "../models/user.model";
import bcrypt from "bcryptjs"; 
import jwt from "jsonwebtoken";


const generateToken = async (user) => {
    const token = jwt.sign({ user }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
    return token;
}

//  @Post - user/register
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body; 
        if(!name || !email || !password) 
            throw new Error("Invalid Data!"); 
        
        const userExists = await User.findOne({ email }).lean();
        if(userExists)
            throw new Error("User already exists!");

        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(password, salt); 
        const user = await User.create({
            name, 
            email, 
            password: hashedPassword
        });

        // generating token 
        const token = await generateToken(user._id);

        return res.json({
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                token,
            },
            success: true, 
        });

    } catch (error) {
        return res.json({ success: false, error: error.message });
    }
}

// @Put - user/login 
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) 
            throw new Error("Invalid data!");
        
        const user = await User.findOne({ email }).lean();
        if(!user) {
            throw new Error("Invalid email Id");
        }
        const matchPassword = await bcrypt.compare(password, user.password);
        if(!matchPassword) {
            throw new Error("Incorrect password");
        }

        const token = await generateToken(user._id);
        return res.json({
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                token
            },
            success: true,
        });
        
    } catch (error) {
        return res.json({ success: false, error: error.message });
    }
}