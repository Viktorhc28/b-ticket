const nodemailer = require('nodemailer');

module.exports = {
    nombreSistema: process.env.NOMBRESISTEMA,
    nombreSistemaAcortado: process.env.NOMBRESISTEMAACORTADO,
    mailSender: process.env.MAILSENDER,
    database: {
        username: process.env.DBUSER,
        password: process.env.DBPASS,
        database: process.env.DBNAME,
        host: process.env.DBHOST
    },
    debug: true,
    transport: nodemailer.createTransport({
        host: process.env.MAILHOST,
        port: 465,
        secure: true, // upgrade later with STARTTLS
        auth: {
            user: process.env.MAILSENDER,
            pass: process.env.MAILPASS,
        }
    })
}