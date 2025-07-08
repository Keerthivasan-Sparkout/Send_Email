export default () => {
    console.log(process.env.SMTP_HOST)
    return ({
        formail: {
            port: process.env.SMTP_PORT,
            host: process.env.SMTP_HOST,
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        }
    })
}