// import { Resolver, Mutation, Arg, Query, UseMiddleware } from 'type-graphql';
// import crypto from 'crypto';
// import jwt from 'jsonwebtoken';
// import nodemailer from 'nodemailer';
// import randomstring from 'randomstring';
// // var GoogleStrategy = require('passport-google-oauth2').Strategy;
// import RegisteredUser from '../schemas/RegisteredUser';
// import SignUpInput from './input-type/SignUpInput';
// import LoginInput from './input-type/LoginUserInput';
// import UserModel from '../../../models/userModel';
// import ProductModel from '../../../models/productModel';
// import LoggedInUser from '../schemas/LoggedInUser';
// import QueryUser from '../schemas/QueryUser';
// import AddQueryUserInput from './input-type/AddQueryUserInput';
// import EditQueryUserInput from './input-type/EditQueryUserInput';
// import QueryUserModel from '../../../models/queryUser';
// import ResetPassword from './input-type/resetPassword';
// import EditAdmin from './input-type/EditAdmin';
// import AppError from '../../../utils/AppError';
// import { isAuth } from '../../../Authorization/isAuth';
// import sendEmail from '../../../utils/sendMail';
// import getMail from '../../../utils/getMail';
// import create_account_mail from '../../../utils/create_account_mail';
// import queryUserMail from '../../../utils/query_user';
// import confirm_password from '../../../utils/confirm_password';
// const signToken = (id: string) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_IN,
//   });
// };
// @Resolver()
// export default class UserResolver {
//   @Mutation(() => RegisteredUser)
//   async addNewAdmin(@Arg('data') data: SignUpInput) {
//     let options = {
//       Appearance: data.permission.Appearance,
//       Blogs: data.permission.Blogs,
//       Settings: data.permission.Settings,
//       Dashboard: data.permission.Dashboard,
//       Product: data.permission.Product,
//       Review: data.permission.Review,
//       email: data.email,
//       Password: data.password,
//     };
//     const newUser = await UserModel.create(data);
//     if (data.sendMail) {
//       let html = create_account_mail(options);
//       let data2 = {
//         subject: 'New Account Registered!',
//         html: html,
//         message: 'hello',
//       };
//       const res = await sendEmail(data.email.toString(), data2);
//       console.log(res);
//     }
//     return newUser;
//   }
//   @Query(() => String)
//   async forgetPassword(@Arg('email') email: String) {
//     // 1. get user from email
//     const user: any = await UserModel.findOne({ email: email });
//     if (!user) return new AppError('user not found', 404);
//     const token = randomstring.generate();
//     // 3. send email
//     const resetUrl = `https://admin-nobarun.vercel.app/auth/reset-password/${token}`;
//     let html = confirm_password(resetUrl);
//     const options = {
//       html,
//       subject: 'Your password reset token valid for 10 min only!',
//     };
//     const response = await sendEmail(email.toString(), options);
//     await UserModel.findByIdAndUpdate(user._id, {
//       resetTokenTimeToExpire: Date.now() + 10 * 60 * 1000,
//       myResetToken: token,
//     });
//     return response;
//   }
//   @Mutation(() => String)
//   async resetPassword(@Arg('data') data: ResetPassword) {
//     // 1. get the user based on the token
//     const user: any = await UserModel.findOne({
//       myResetToken: data.token,
//       resetTokenTimeToExpire: { $gt: Date.now() },
//     });
//     if (!user) {
//       return new AppError('Token is invalid!', 400);
//     }
//     user.password = data.password;
//     user.myResetToken = undefined;
//     user.save();
//     return 'success';
//   }
//   @UseMiddleware(isAuth)
//   @Mutation(() => QueryUser)
//   async addNewQueryUserByAdmin(@Arg('data') data: AddQueryUserInput) {
//     const queryUser = await QueryUserModel.create(data);
//     await ProductModel.findOneAndUpdate(
//       { productCode: data.productCode },
//       { $inc: { productEnqueryCount: 1 } }
//     );
//     return queryUser;
//   }
//   @Mutation(() => QueryUser)
//   async addNewQueryUserByUser(@Arg('data') data: AddQueryUserInput) {
//     const queryUser: any = await QueryUserModel.create(data);
//     let p: any = await ProductModel.findOneAndUpdate(
//       { productCode: data.productCode },
//       { $inc: { productEnqueryCount: 1 } },
//       { new: true }
//     );
//     if (!p) {
//       return new AppError('product not found', 404);
//     }
//     let option = {
//       clientName: data.name,
//       mobile: data.phone,
//       email: data.email,
//       productCode: data.productCode,
//       productName: p.productName,
//       company: data.company,
//       message: data.message,
//       location: data.address,
//       link: `https://www.nobarunbd.com/${p.slug}`,
//       attachment: data.attachment,
//     };
//     let html = queryUserMail(option);
//     let options = {
//       clientName: data.name,
//       mobile: data.phone,
//       email: data.email,
//       productCode: data.productCode,
//       productName: p.productName,
//       company: data.company,
//       message: data.message,
//       location: data.address,
//       link: `https://www.nobarunbd.com/${p.slug}`,
//       attachment: `https://nobarunawsvideouploader.s3.ap-south-1.amazonaws.com/${data.attachment}`,
//       html: html,
//       subject: `New Inquiry: ${p.productName}`,
//     };
//     await getMail(data.email.toString(), options);
//     return queryUser;
//   }
//   // <h1>Name : ${option.clientName}</h1>
//   // <h1>Mobile: ${option.mobile}</h1>
//   // <h1>Email: ${option.email}</h1>
//   // <h1>Company: ${option.company}</h1>
//   // <h1>Location: ${option.location}</h1>
//   // <h1>ProductCode: ${option.productCode}</h1>
//   // <h1>ProductName: ${option.productName}</h1>
//   // <h1>Link: <a href="${option.link}">${option.link}</a></h1>
//   // <h1>Client Message</h1>
//   // <h2>Dear Sir,</h2>
//   // <p>${option.message}</p>
//   // <h2>Best Regards,</h2>
//   // <h2>${option.clientName}</h2>
//   // <h2>${option.attachment}</h2>
//   @UseMiddleware(isAuth)
//   @Mutation(() => String)
//   async editQueryUserInfo(@Arg('data') data: EditQueryUserInput) {
//     await QueryUserModel.findByIdAndUpdate(data.editId, data.editableObject);
//     return 'successfully edited';
//   }
//   // @UseMiddleware(isAuth)
//   @Query(() => [QueryUser])
//   async getAllQueryUsers() {
//     const queryUsers = await QueryUserModel.find();
//     return queryUsers;
//   }
//   @UseMiddleware(isAuth)
//   @Query(() => QueryUser)
//   async getSingleQueryUserById(@Arg('queryUserId') queryUserId: String) {
//     const queryUserModel = await QueryUserModel.findById(queryUserId);
//     return queryUserModel;
//   }
//   @UseMiddleware(isAuth)
//   @Mutation(() => String)
//   async removeQueryUserById(@Arg('queryUserId') queryUserId: String) {
//     await QueryUserModel.findByIdAndDelete(queryUserId);
//     return 'successfullyDeleted';
//   }
//   @Query(() => LoggedInUser || AppError)
//   async login(@Arg('data') data: LoginInput) {
//     const user: any = await UserModel.findOne({ email: data.email }).select(
//       '+password'
//     );
//     console.log(user);
//     if (
//       !user ||
//       !(await user.isPasswordCorrect(data.password, user.password))
//     ) {
//       return new AppError('Wrong Email or Password', 401);
//     } else {
//       const token = signToken(user._id);
//       // Remove password from output
//       user.password = undefined;
//       return {
//         id: user._id,
//         displayName: user.displayName,
//         address: user.address,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         role: user.role,
//         provider: user.provider,
//         number: user.number,
//         notes: user.notes,
//         createdAt: user.createdAt,
//         token,
//         permission: user.permission,
//       };
//     }
//   }
//   @UseMiddleware(isAuth)
//   @Query(() => RegisteredUser)
//   async getSingleAdminById(@Arg('adminId') adminId: String) {
//     const user = await UserModel.findById(adminId);
//     return user;
//   }
//   @UseMiddleware(isAuth)
//   @Query(() => String)
//   async senAuthMail(@Arg('emailTo') emailTo: String) {
//     // create transporter
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: 'badhonk@gmail.com',
//         pass: '01775530735',
//       },
//     });
//     const name = 'blending101';
//     let mailOptions = {
//       from: 'shaharaaktermunabk@gmail.com',
//       to: emailTo,
//       subject: 'verrification',
//       html: `<h1>hello how are you? i am ${name}</h1>`,
//     };
//     try {
//       //@ts-ignore
//       await transporter.sendMail(mailOptions);
//       return 'successfull';
//     } catch (e) {
//       return new AppError('email send failed', 401);
//     }
//   }
//   // @UseMiddleware(isAuth)
//   @Query(() => [RegisteredUser])
//   async getAllTheUsers() {
//     const users = await UserModel.find();
//     console.log(users);
//     return users;
//   }
//   @UseMiddleware(isAuth)
//   @Mutation(() => String)
//   async deleteUserById(@Arg('userId') userId: string) {
//     await UserModel.findByIdAndDelete(userId);
//     return 'successfully updated';
//   }
//   @UseMiddleware(isAuth)
//   @Mutation(() => String)
//   async editAdmin(@Arg('data') data: EditAdmin) {
//     await UserModel.findByIdAndUpdate(data.editId, data.editableObject);
//     return 'successfully edited';
//   }
// }
