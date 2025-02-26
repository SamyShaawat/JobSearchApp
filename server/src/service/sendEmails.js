import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html, attachments) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.emailSender,
            pass: process.env.emailSenderPassword,
        },
    });

    const info = await transporter.sendMail({
        from: `"Eng. Samy Mostafa" <${process.env.emailSender}>`,
        to: to ? to : "samy.mostafa2001@gmail.com",
        subject: subject ? subject : "Greeting ❤️",
        html: html ? html : "<b>Hello world!!!!</b>",
        attachments: attachments ? attachments : []


    });

    if (info.accepted.length) {
        return true;
    }
    return false;

}