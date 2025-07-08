import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EmailService {

    constructor(private mailerService: MailerService, private configService: ConfigService) { }

    async registerMail(email: string, name?: string) {
        await this.mailerService.sendMail({
            to: email,
            from: this.configService.get<string>('formail.user'),
            subject: "Register mail",
            template: 'hello',
            context: {
                name: name ? name : email.split('@')[0]
            },
        })
    }

}