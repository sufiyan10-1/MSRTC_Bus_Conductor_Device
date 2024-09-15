import dbConnect from "@/lib/dbConnect";
import IdentityModel from "@/models/Identity";
import { NextResponse } from "next/server";

export async function POST(request) {
    await dbConnect();

    try {
        const { IdNumber, passNumber } = await request.json();
        

        if (!IdNumber && !passNumber) {
            return NextResponse.json({
                success: false,
                message: "ID number is not found"
            }, { status: 404 });
        } else {
            const today = new Date();
            const dateOfToday = today.getDate(); // Corrected declaration
            Number(dateOfToday)
            console.log(dateOfToday);

            // Find identity to check if today's date is already in the `currentDay` array
            const identity = await IdentityModel.findOne({ IdNumber });

            if (!identity) {
                return NextResponse.json({
                    success: false,
                    message: "Identity not found"
                }, { status: 400 });
            }
        
            // Check if today's date is already in the `selectionGoing` array
            if (identity.monthlyPass[passNumber].selectionComing && identity.monthlyPass[passNumber].selectionComing.includes(dateOfToday)) {
                return NextResponse.json({
                    success: false,
                    message: "Already updated for today" 
                }, { status: 400 });
            }

            // Proceed to update with today's date
            const updatedIdentity = await IdentityModel.findOneAndUpdate(
                { IdNumber },
                { $push: {
                    [`monthlyPass.${passNumber}.selectionComing`]: dateOfToday 
                }}, 
                { new: true }  // Return the updated document
            );
            console.log(updatedIdentity)
           if(updatedIdentity){ 
            return NextResponse.json({
                success: true,
                message: "Date updated successfully"
            }, { status: 200 });
        }
      }
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            success: false,
            message: "Unexpected error occurred"
        }, { status: 500 });
    }
}
