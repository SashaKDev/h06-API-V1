export type User = {
    login: string,
    password: string,
    email: string,
    createdAt: string,
    emailConfirmation: {
        confirmationCode: string,
        expirationDate: Date;
        isConfirmed: boolean,
    }
}