import nodemailer from "nodemailer";
import {SETTINGS} from "../core/settings/settings";

export const mailService = {
    async sendMail (email: string, confirmationCode: string) {
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "sasha.val252000@gmail.com",
                pass: SETTINGS.GMAIL_PASS,
            }
        })

        const info = await transport.sendMail({
            from: "sasha.val252000@gmail.com",
            to: email,
            subject: "Hello!",
            text: `<h1>Thank for your registration</h1>
                <p>To finish registration please follow the link below:
                <a href='https://somesite.com/confirm-email?code=${confirmationCode}'>complete registration</a>
                </p>`
        })
        console.timeEnd("send")
        console.log("Mail info:", info);

    }
}