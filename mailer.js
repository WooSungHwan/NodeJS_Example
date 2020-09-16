const nodemailer = require('nodemailer');

const main = async () => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: true,
        auth: {
            user: 'studyfarm20@gmail.com',
            pass: '-',
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"스터디팜" <studyfarm20@gmail.com>',
        to: 'doqndnffo@gmail.com',
        subject: '테스트',
        text: 'test',
        html: `<b>'test'</b>`,
    });

    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    res.status(200).json({
        status: 'Success',
        code: 200,
        message: 'Sent Auth Email',
    });
};

main().catch(console.error);
