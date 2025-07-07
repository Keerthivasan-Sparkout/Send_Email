import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class EmailService {

    constructor(private mailerService: MailerService) { }

    async registerMail(email: string) {
        await this.mailerService.sendMail({
            to: email,
            from: "no.reply@nilachains.com",
            subject: "Register mail",
            template: 'hello', 
            context: {
                hello:"abcd"
            },
        })
    }

}