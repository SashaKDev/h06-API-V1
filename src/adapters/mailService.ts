import nodemailer from "nodemailer";
import {SETTINGS} from "../core/settings/settings";

export const mailService = {
    async sendMail (email: string) {
        const transopt = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "sasha.val252000@gmail.com",
                pass: SETTINGS.GMAIL_PASS,
            }
        })

        const info = await transopt.sendMail({
            from: "sasha.val252000@gmail.com",
            to: email,
            subject: "Hello!",
            text: "Test message"
        })
        console.timeEnd("send")
        console.log("Mail info:", info);

    }
}