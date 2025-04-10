import { User } from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {

    const { email, otp } = await req.json();

    try {
        const found = await User.findOne({ email });

        if (!found) {
            return NextResponse.json({ status: 404, message: "User not found" });
        }

        const mail = process.env.SPARK_MAIL;
        const pass = process.env.SPARK_PASSWORD;

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
            subject: "Account Recovery OTP",
            text: `Your one-time password for account recovery is ${otp}`,
        };

        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                console.log(error);
            }
        });

        return NextResponse.json({ status: 200, message: "User found" });

    } catch (err) {
        return NextResponse.json({ status: 500, message: "Something went wrong" });
    }

}

export async function PUT(req: NextRequest){
    const { password, email } = await req.json();

    try {

        const found = await User.findOne({email});
        const matched = await bcrypt.compare(password, found.password);
       
        if(matched){
            return NextResponse.json({ status: 400, message: "Cannot be same password" });
        }

        const hashed = await bcrypt.hash(password, 10);

        found.password = hashed;
        await found.save();

        return NextResponse.json({ status: 201, message: "Password changed" });
    } catch (err) {
        return NextResponse.json({ status: 500, message: "Something went wrong" });
    }
}