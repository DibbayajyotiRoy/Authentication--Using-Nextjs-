import { connect } from '@/dbConfig/dbConfig';
import User from '@/model/userModel';
import { NextRequest, NextResponse } from 'next/server'
import { getDataFromToken } from '@/helpers/getDataFromToken';

connect()

export async function POST(req: NextRequest) {
  //extract data from token
  const userId = await getDataFromToken(req);
  const user = await User.findOne({ _id: userId }).select("-password")
  // check if there is no user
  return NextResponse.json({
    message: "User found",
    success: true,
    data: user
  })
}
