import { connect } from '@/dbConfig/dbConfig';
import User from '@/model/userModel';
import { request } from 'http';
import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import { sendEmail } from './../../../../helpers/mailer';


connect()

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { username, password, email } = reqBody;
    // validation
    console.log(reqBody)

    const user = await User.findOne({email})

    if (user) {
        return NextResponse.json(
          {
            error: 'Email already exists',
          },
          { status: 400 }
        );
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword
    })

    const savedUser = await newUser.save()
    console.log(savedUser)

    //send verification email
    await sendEmail({email, emailType:"VERIFY",userId:savedUser._id})

    return NextResponse.json({
      message: 'User created successfully. Please check your email to verify account',
      success: true,
      savedUser
    })

  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}
