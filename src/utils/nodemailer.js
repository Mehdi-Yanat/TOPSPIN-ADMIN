const nodemailer = require("nodemailer");
const { SMTP_USER, SMTP_PASSWORD } = process.env

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
    },
});

module.exports = transporter