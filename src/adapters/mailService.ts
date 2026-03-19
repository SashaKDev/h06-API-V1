import nodemailer from "nodemailer";
import {SETTINGS} from "../core/settings/settings";

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "sasha.val252000@gmail.com",
        pass: SETTINGS.GMAIL_PASS,
    }
})

export const mailService = {
    async sendMail (email: string, confirmationCode: string): Promise<void> {


        const info = await transport.sendMail({
            from: "sasha.val252000@gmail.com",
            to: email,
            subject: "Hello!",
            html: `<h1>Thank for your registration</h1>
                <p>To finish registration please follow the link below:
                <a href='https://somesite.com/confirm-email?code=${confirmationCode}'>complete registration</a>
                </p>`
        })
        // console.timeEnd("send")
        // console.log("Mail info:", info);

    },

    async sendPasswordRecoveryMail (email: string, recoveryCode: string): Promise<void> {
        const info = await transport.sendMail({
            from: "sasha.val252000@gmail.com",
            to: email,
            subject: "Hello!",
            html: `<p>To finish password recovery please follow the link below:
                <a href='https://somesite.com/password-recovery?recoveryCode=${recoveryCode}'>recovery password</a>
                </p>`
        })
        // console.timeEnd("send")
        // console.log("Mail info:", info);

    }
}