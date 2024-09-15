import dbConnect from "@/lib/dbConnect";
import IdentityModel from "@/models/Identity";
import { NextResponse } from "next/server";

export async function POST(request) {
  await dbConnect();

  try {
    const { IdNumber } = await request.json();

    const identity = await IdentityModel.findOne({ IdNumber: IdNumber });

    if (!identity) {
      console.log("No identity found for : " + IdNumber);
      return NextResponse.json(
        {
          success: false,
          message: "No Identity Found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "identity found", 
        data: identity, // Return the entire identity object or specific fields
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while fetching data:", error);
    return NextResponse.json(
      {
        success: false,
        message: error,
      },
      { status: 500 }
    );
  }
}
