const express=require("express");
const router=express.Router();
const userRouter=require("./user");
const AccountsRouter=require("./accounts");

router.use('/user',userRouter)
router.use('/account',AccountsRouter);

// router.get("/",(req,res)=>{
//     return res.status(200).json({
//       msg:"Working"
//     })
//   })

module.exports=router;