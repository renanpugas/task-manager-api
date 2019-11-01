const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) =>{

    sgMail.send({
        to: email,
        from: "renanpugas@gmail.com",
        subject: "Thanks for joining in!",
        text: `Welcome to the app ${name}. Let me know how you get along with the app.`
        //html: ""
    });

};

const sendCancelationEmail = (email, name) =>{

    sgMail.send({
        to: email,
        from: "renanpugas@gmail.com",
        subject: "Hello",
        text: `Comeback for our site ${name}`
    });

};

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}