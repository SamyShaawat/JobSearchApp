import { EventEmitter } from "events"
import jwt from "jsonwebtoken"
import { sendEmail } from "../service/sendEmails.js";

export const eventEmitter = new EventEmitter()


eventEmitter.on("sendEmail", async (data) => {
    const { email } = data;
    // send email to confirm
    const token = jwt.sign({ email }, process.env.SIGNATURE_CONFIRMATION)
    const link = `http://localhost:3000/users/confirmEmail/${token}`

    await sendEmail(email, "Confirm Email", `<a href='${link}' >Confirm me</a>`)
})
