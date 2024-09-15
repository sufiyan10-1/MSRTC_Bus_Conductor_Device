import mongoose,{Schema} from "mongoose";
import { Stick } from "next/font/google";
 
const passSchema = new mongoose.Schema({
   paymentId:{
     type: String,
     required: true
   },
   paymentSuccessfull:{
    type: Boolean,
    default: false,
   },
    startDate:{
    type: String,
    required: true,
   },
   endDate:{
    type: String,
    required: true,
   },
   passFees:{
    type: Number,
    required: true
   },
   selectionGoing: [{ 
    type: Number,
    required: true, 
   }],
   selectionComing: [{ 
    type: Number,
    required: true, 
    }]
 });
  

const IdentitySchema = new mongoose.Schema({
     
    username: {
        type: String,
        required: true
    },
    studentName: {
        type: String,
        required: [true, "student is required"]
    },
    studentAddress: {
        type: String,
        required: [true, "address is required"]
    },
    studentDOB: {
        type: Date,
        required: [true, "studentDOB is required"]
    },
    nameOfCollegeOrSchool: {
        type: String,
        required: [true, "nameOfCollegeOrSchool is required"]
    },
    addressOfCollegeOrSchool: {
        type: String,
        required: [true, "nameOfCollegeOrSchool is required"]
    },
    studClass: {
        type: String,
        required: [true, "studClass is required"]
    },
    academicYearFrom: {
        type: String,
        required: [true, "academicYearFrom is required"]
    },
    academicYearTo: {
        type: String,
        required: [true, "academicYearTo is required"]
    },
    distanceFrom: {
        type: String,
        required: [true, "distanceFrom is required"]
    },
    distanceTo: {
        type: String,
        required: [true, "distanceTo is required"]
    },
    studentSign: {
        type: String,
        required: [true, "studentSign is required"]
    },  
    studentPhoto: {
        type: String,
        required: [true, "studentPhoto is required"]
    },  
    aadharCard: {
        type: String,
        required: [true, "aadharCard is required"]
    },
    bonafied: {
        type: String,
        required: [true, "bonafied is required"]
    },
    feesRecipt: {
        type: String,
        required: [true, "feesRecipt is required"]
    },
    identityVerified: {
        type: Boolean,
        default: false,
        required: [true, "username is Required"]
     },
    status:{
        type: String,
        required: [true, "status is required"]
    }, 
    IdNumber:{
       type: Number,
       required: true
    },
    monthlyPass:[passSchema]
})
const IdentityModel = (mongoose.models.Identity) ||  mongoose.model('Identity', IdentitySchema);

export default IdentityModel;