// import {CommentType} from "../types/commentType.js";
// import {PostsRepository} from "../../posts/repositories/postsRepository.js";
// import {inject} from "inversify";
// import {UsersRepository} from "../../users/repository/usersRepository.js";
//
// interface UserMethods {
//     convertMoney(fromWalletId: string, toWalletId: string, amount: number): void;
//     increaseWalletBalance(walletId: string, amount: number): void;
//     decreaseWalletBalance(walletId: string, amount: number): void;
// }
// type CommentStatics = typeof CommentEntity;
//
// type UserModel = Model<User, {}, UserMethods> & UserStatics;
//
// export type UserDocument = HydratedDocument<User, UserMethods>;
//
// const userSchema = new mongoose.Schema<User, UserModel, UserMethods>(
//     {
//         name: { type: String, required: true },
//         age: { type: Number, required: true },
//         wallets: { type: [walletSchema] },
//     },
//     { optimisticConcurrency: true }
// );
//
// class CommentEntity {
//     private constructor(
//         public postId: string,
//         public content: string,
//         public createdAt: string,
//         public userId: string,
//         public userLogin: string,
//         public likesInfo: {
//             likes: number,
//             dislikes: number,
//         }
//     ) {}
//
//     static async createComment(dto: CommentType): CommentType
//     {
//
//         const comment = new CommentModel({...dto});
//         return comment;
//     }
//
//     convertMoney(fromWalletId: string, toWalletId: string, amount: number) {
//         const fromWallet = this.wallets.find((wallet) => wallet._id.toString() === fromWalletId);
//
//         const toWallet = this.wallets.find((wallet) => wallet._id.toString() === toWalletId);
//
//         if (!fromWallet || !toWallet) {
//             throw new Error('some wallet not found');
//         }
//
//         fromWallet.balance = fromWallet.balance - amount;
//         toWallet.balance += amount;
//     }
//
//     increaseWalletBalance(walletId: string, amount: number) {
//         const wallet = this.wallets.find((wallet) => wallet._id.toString() === walletId);
//
//         if (!wallet) {
//             throw new Error('wallet not found');
//         }
//
//         wallet.balance += amount;
//     }
//
//     decreaseWalletBalance(walletId: string, amount: number) {
//         const wallet = this.wallets.find((wallet) => wallet._id.toString() === walletId);
//
//         if (!wallet) {
//             throw new Error('wallet not found');
//         }
//
//         wallet.balance -= amount;
//     }
// }
//
// userSchema.loadClass(UserEntity);
//
// export const UserModel = model<User, UserModel>('users-l4', userSchema);
