import ejs from "ejs";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "../environment.config";

export const transporter = nodemailer.createTransport({
  host: config.email_host,
  auth: {
    user: config.email_username,
    pass: config.email_password
  },
  secure: false,
  port: config.email_port
//   tls: {
//     rejectUnauthorized: config.email_use_tls
//   }
});

export const send = ({
  template,
  args,
  ...options
}: {
  template: string;
  args: any;
  [key: string]: any;
}) =>
  new Promise((resolve, reject) => {
    ejs.renderFile(
      path.join(path.dirname(__filename), "templates", template + ".ejs"),
      args || {},
      (err, html) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        const mailOptions = {
          from: config.email_username,
          html: html,
          ...options
        };
        transporter.sendMail(mailOptions).then(resolve).catch(reject);
      }
    );
  });
