import { connect } from '@/dbConfig/dbConfig';
import User from '@/model/userModel';
import jwt from "jsonwebtoken"
import bcryptjs from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'

connect()

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { password, email } = reqBody;
    // validation
    console.log(reqBody);

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        {
          error: "User doesn't exist",
        },
        { status: 400 }
      );
    }

    console.log("User exists");

    const validPassword = await bcryptjs.compare(password, user.password);

    if (!validPassword) {
      return NextResponse.json(
        {
          error: "Check your credentials",
        },
        { status: 400 }
      );
    }

    const tokenData = {
      id: user._id,
      email: user.email,
      username: user.username,
    };

    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!,{ expiresIn: '1hr' } );

    const response = NextResponse.json({
        message: "Logged in successfully",
        success : true
    })

    response.cookies.set('token', token, {
        httpOnly: true
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
