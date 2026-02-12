export type UserDBType = {
    login: string,
    password: string,
    email: string,
    createdAt: Date,
    emailConfirmation: {
        confirmationCode: string,
        expirationDate: Date;
        isConfirmed: boolean,
    }
}