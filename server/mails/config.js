import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodemailer.createTransport({

    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
    secure:false,
    tls: {
        rejectUnauthorized:process.env.EMAIL_USE_TLS
    }
});

export const send = ({ template, args, ...options }) =>
    new Promise((resolve, reject) => {
        ejs.renderFile(
            path.join(
                path.dirname(fileURLToPath(import.meta.url)),
                "templates",
                template + ".ejs"
            ),
            args || {},
            (err, html) => {
                if (err) {
                    console.log(err);
                    return reject(err);}
                const mailOptions = {
                    from: process.env.EMAIL_USERNAME,
                    html: html,
                    ...options,
                };
                transporter.sendMail(mailOptions).then(resolve).catch(reject);
            }
        );
    });
