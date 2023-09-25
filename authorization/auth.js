// import { MiddlewareFn } from 'type-graphql';
// import jwt from 'jsonwebtoken';
// import { promisify } from 'util';
// import UserModel from '../models/userModel';
// import { MyContext } from '../Types/MyContext';
// import AppError from '../utils/AppError';
// export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
//   const authHeader = context.req.get('Authorization');
//   if (!authHeader) {
//     return new AppError('User is not logged in', 401);
//   }
//   const token = authHeader.split(' ')[1];
//   if (!token || token === ' ') {
//     return new AppError('User is not logged in', 401);
//   }
//   const decoded: any = await promisify(jwt.verify)(
//     token,
//     process.env.JWT_SECRET
//   );
//   if (!decoded) {
//     return new AppError('Session Expired', 401);
//   }
//   const currentUser: any = await UserModel.findById(decoded.id);
//   // context.req.body = { ...context.req.body, currentUser };
//   if (currentUser.role !== 'admin') {
//     return new AppError('User is not Authorized', 401);
//   }
//   return next();
// };
