import { connectDB } from "@/config/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import { User } from '@/models/userModel';
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
    await connectDB();

    const { action, email, password, name, otp } = await req.json();

    if (action === 'register') {

        try {
            const found = await User.findOne({ email });

            if (found) {
                return NextResponse.json({
                    status: 400,
                    message: "User already registered"
                });
            }

            const mail = process.env.SPARK_MAIL;
            const pass = process.env.SPARK_PASSWORD;

            // console.log(mail, pass, otp);

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: mail,
                    pass: pass,
                },
            });

            const mailOptions = {
                from: mail,
                to: email,
                subject: "OTP for recovering password",
                text: `Your one-time password for account verification is ${otp}`,
            };

            transporter.sendMail(mailOptions, (error) => {
                if (error) {
                    console.log(error);
                }
            });

            return NextResponse.json({
                status: 200,
                message: "Verification mail sent"
            });
        } catch (error) {
            console.log(error);
            return NextResponse.json({
                status: 500,
                message: "Something went wrong"
            });
        }
    }
    else if (action === 'login') {
        try {
            const found = await User.findOne({ email });

            if (!found) {
                return NextResponse.json({
                    status: 404,
                    message: "User not found"
                });
            }

            const matched = await bcrypt.compare(password, found.password);

            if (!matched) {
                return NextResponse.json({
                    status: 400,
                    message: "Incorrect password"
                });
            }

            const secret = process.env.JWT_SECRET as string;

            const token = jwt.sign({ id: found._id }, secret, { expiresIn: '1h' });

            const res = NextResponse.json({
                status: 200,
                message: "Login successful",
            });

            res.cookies.set('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                path: '/',
                maxAge: 86400,
            });

            return res;

        } catch (error) {
            NextResponse.json({
                status: 500,
                message: "Something went wrong"
            });
        }
    }
    else if (action === 'verify') {

        console.log(action);
       
        try {
            const hashed = await bcrypt.hash(password, 10);

            const newUser = new User({
                name, email, password: hashed
            });
    
            await newUser.save();
    
            return NextResponse.json({
                status: 200,
                message: "User registered"
            });
    
        } catch (error) {
            return NextResponse.json({
                status: 500,
                message: "Something went wrong"
            });
        }

    }
}
