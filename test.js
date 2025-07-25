import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// let password = "447474";
// console.log(password);
// let hashpassword = await bcrypt.hash(password,10);
// console.log(hashpassword);
// let inpass = "$2b$10$0htYprymQrxHH.sDv7pQHO/sVKWwECMJfa6mtGeKZpEXuLe/jitgG";
// let istrue  = await bcrypt.compare(password,inpass);
// console.log(istrue);

// const token = jwt.sign({password : "447474" , username : "girishkuwar11"}, process.env.JWT_SECRET);
// console.log(token);
let tmptoken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXNzd29yZCI6IjQ0NzQ3NCIsInVzZXJuYW1lIjoiZ2lyaXNoa3V3YXIxMSIsImlhdCI6MTc1MzQ0NTU5N30.AFFk74F5Ah2WggbRpW_A8uyDq7MKJJBknnW0VC6iPPQ";
let data = jwt.verify(tmptoken,process.env.JWT_SECRET);
console.log(data.username);
let timestamp = new Date(data.iat * 1000);
console.log(timestamp);
