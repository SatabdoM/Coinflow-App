const mongoose=require("mongoose");
mongoose.connect('mongodb+srv://satabdomajumdertech:Satabdo1234567@cluster0.yreueyv.mongodb.net/PaymentApp2');

const UserSchema= new mongoose.Schema({
    username:String,
    firstname:String,
    lastname:String,
    password:String
});
const accountSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    balance:{
        type:Number,
        required:true
    }
})

const User=mongoose.model('User',UserSchema);
const Accounts=mongoose.model('Accounts',accountSchema);
module.exports={
    User,
    Accounts
}